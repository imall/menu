const { createApp, reactive, ref, computed, watch } = Vue;

createApp({
  setup() {
    const menu = ref([]);
    const qty = reactive({});
    const showModal = ref(false);
    const toast = ref("");
    const fallbackText = ref("");
    const itemMap = {};

    let toastTimer = null;
    const showToast = (msg) => {
      toast.value = msg;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.value = ""; }, 2200);
    };

    fetch("menu.json")
      .then(res => res.json())
      .then(data => {
        menu.value = data;
        let order = 0;
        data.forEach(g => g.items.forEach(i => {
          itemMap[i.id] = { name: i.name, price: i.price, order: order++ };
        }));

        // 菜單就緒後才還原分享連結，decodeOrder 需要 itemMap 驗證代號
        const code = new URLSearchParams(location.search).get("o");
        if (code && decodeOrder(code) > 0) showToast("已載入分享的訂單");

        // 之後每次加減都同步網址，讓瀏覽器內建的分享／書籤也拿得到訂單
        watch(qty, syncUrl);
        syncUrl();
      })
      .catch(err => console.error("無法載入 menu.json：", err));

    const inc = (item) => { qty[item.id] = (qty[item.id] || 0) + 1; };
    const dec = (item) => {
      if (qty[item.id] > 0) qty[item.id]--;
      if (qty[item.id] === 0) delete qty[item.id];
    };

    const orderLines = computed(() =>
      Object.keys(qty)
        .filter(id => qty[id] > 0 && itemMap[id])
        .sort((a, b) => itemMap[a].order - itemMap[b].order)
        .map(id => ({ id, qty: qty[id], name: itemMap[id].name, price: itemMap[id].price }))
    );
    const total = computed(() => orderLines.value.reduce((s, l) => s + l.price * l.qty, 0));
    const totalCount = computed(() => orderLines.value.reduce((s, l) => s + l.qty, 0));

    // 訂單 ⇄ 網址：a1.2_b3.1（. 與 _ 都是 URL unreserved 字元，不會被跳脫）
    const encodeOrder = () =>
      orderLines.value.map(l => `${l.id}.${l.qty}`).join("_");

    const decodeOrder = (str) => {
      let applied = 0;
      str.split("_").forEach(part => {
        const seg = part.split(".");
        if (seg.length !== 2) return; // 例如 a1.2.5 這種畸形字串一律拒絕
        const [id, n] = seg;
        if (!itemMap[id] || !/^\d+$/.test(n)) return;
        const num = parseInt(n, 10);
        if (num < 1 || num > 99) return;
        qty[id] = num;
        applied++;
      });
      return applied;
    };

    const orderUrl = (forShare = false) => {
      const params = [];
      const code = encodeOrder();
      if (code) params.push("o=" + code);
      // LINE 內建瀏覽器看到 openExternalBrowser=1 會改用系統預設瀏覽器開啟。
      // 只加在分享出去的連結上，載入後 syncUrl 會把它從網址列清掉。
      if (forShare) params.push("openExternalBrowser=1");
      return location.origin + location.pathname + (params.length ? "?" + params.join("&") : "");
    };

    const syncUrl = () => history.replaceState(null, "", orderUrl());

    const shareText = () => {
      const lines = orderLines.value.map(l => `${l.name} $${l.price} × ${l.qty} = $${l.price * l.qty}`);
      return [
        "🍗 3Q 脆皮雞排 訂單",
        ...lines,
        `合計 $${total.value}`,
        "",
        "點連結可看明細／繼續加點：",
        orderUrl(true)
      ].join("\n");
    };

    const copyToClipboard = async (text, okMsg) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(okMsg);
      } catch (err) {
        fallbackText.value = text; // 非 HTTPS 或舊瀏覽器，改成讓使用者手動複製
      }
    };

    const shareOrder = async () => {
      const text = shareText();
      // 連結寫在 text 內而不另傳 url：部分 App 收到兩者時只會取其一
      if (navigator.share) {
        try {
          await navigator.share({ title: "3Q 脆皮雞排 訂單", text });
          return;
        } catch (err) {
          if (err.name === "AbortError") return; // 使用者自己取消，不是錯誤
        }
      }
      await copyToClipboard(text, "已複製訂單，可直接貼上");
    };

    // 桌面的系統分享面板沒有「複製連結」也沒有 LINE，所以獨立給一顆
    const copyLink = () => copyToClipboard(orderUrl(true), "已複製連結");

    const resetAll = () => {
      Object.keys(qty).forEach(k => delete qty[k]);
      fallbackText.value = "";
      showModal.value = false;
    };

    return {
      menu, qty, inc, dec, showModal, orderLines, total, totalCount,
      resetAll, shareOrder, copyLink, toast, fallbackText
    };
  }
}).mount("#app");
