/**
 * 1. 完整餐點清單與單價 (確保與 HTML 的 ID 完全對應)
 */
const menuPrices = {
    "Beef_Burger": 80, "Cheese_Burger": 90, "French_Fries": 40,
    "Chicken_Nuggets": 50, "Cola": 30, "Black_Tea": 30,
    "Corn_Soup": 45, "Meat_Sauce_Pasta": 120, "Seafood_Pasta": 160,
    "BBQ_Roasted_Chicken": 150, "Margherita_Pizza": 180,
    "Yogurt_Fruit_Salad": 80, "Avocado_Shrimp_Salad": 150
};

/**
 * 2. 自動計算總額與折扣
 */
    function calculateTotal() {
        // --- 這裡開始是新增的音效「熱身」代碼 ---
        const clickAudio = document.getElementById('clickSound');
        if (clickAudio) {
            clickAudio.muted = true; // 先靜音播放
            clickAudio.play().then(() => { 
                clickAudio.muted = false; // 成功啟動後解除靜音
            }).catch(() => {
                // 靜默處理尚未獲得授權的情況
            });
        }
        // --- 新增結束 ---
        
    let subtotal = 0;
    for (let id in menuPrices) {
        const input = document.getElementById(id);
        if (input) {
            let qty = parseInt(input.value) || 0;
            subtotal += qty * menuPrices[id];
        }
    }

    const discountEl = document.getElementById('discount-info');
    const totalDisplay = document.getElementById('total-price');

    // 滿 500 打 9 折邏輯
    if (subtotal >= 500) {
        let finalPrice = Math.round(subtotal * 0.9);
        discountEl.innerText = "✨ 恭喜！已達 $500 門檻，享 9 折優惠";
        totalDisplay.innerText = finalPrice;
    } else {
        discountEl.innerText = subtotal > 0 ? `還差 $${500 - subtotal} 即可享 9 折` : "";
        totalDisplay.innerText = subtotal;
    }
}

/**
 * 3. 結帳功能：修正音效播放與排除 Modal 錯誤
 */
function checkout() {
    const totalDisplay = document.getElementById('total-price');
    const finalTotal = parseInt(totalDisplay.innerText) || 0;

    if (finalTotal > 0) {
        // --- 播放音效 (修正版) ---
        const audio = document.getElementById('successSound');
        if (audio) {
            audio.pause(); // 先停止前一次播放
            audio.currentTime = 0; 
            audio.play().catch(e => console.log("音效播放受阻，可能是瀏覽器限制:", e));
        }

        // --- 顯示通知畫面 ---
        showNotice(`🛍️ 訂單發送成功！<br>結帳總金額為：<b>$${finalTotal}</b> 元。<br>羊咩咩正在努力準備中！`);

        // --- 3秒後自動清空 (不依賴不存在的 Modal) ---
        setTimeout(() => {
            const overlay = document.getElementById('notice-overlay');
            if (overlay) overlay.remove();
            clearAll(); 
        }, 3000);

    } else {
        showNotice("您的購物籃還是空的喔！");
    }
}

/**
 * 4. 清除與通知功能
 */
function clearAll() {
    for (let id in menuPrices) {
        const input = document.getElementById(id);
        if (input) input.value = 0;
    }
    calculateTotal();
}

function showNotice(msg) {
    const existing = document.getElementById('notice-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'notice-overlay';
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px);
        display: flex; align-items: center; justify-content: center;
        z-index: 99999;
    `;

    overlay.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 30px; text-align: center; border-top: 10px solid #D4AF37; max-width: 400px; width: 90%;">
            <h2 style="color: #1a2a6c; font-weight: bold;">🔔 系統通知</h2>
            <p style="font-size: 1.2rem; margin: 25px 0; color: #333;">${msg}</p>
            <button onclick="document.getElementById('notice-overlay').remove()" 
                    style="background: #D4AF37; color: white; border: none; padding: 12px 50px; border-radius: 50px; font-weight: bold; cursor: pointer;">
                確定
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}