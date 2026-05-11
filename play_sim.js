let state = {
    week: 1,
    maxWeeks: 12,
    cash: 10000,
    components: 20,
    laptops: 10,
    incomingComponents: 0,
    demand: 0
};

const CONSTANTS = {
    COMP_COST: 200,
    PROD_COST: 50,
    PRICE: 500,
    HOLD_COMP: 5,
    HOLD_LAPTOP: 10,
    MAX_PROD: 50
};

console.log("=== BẮT ĐẦU MÔ PHỎNG CHIẾN THUẬT TỐI ƯU ===");
console.log(`Vốn ban đầu: $${state.cash}`);

for (let i = 1; i <= 12; i++) {
    // Random nhu cầu từ 10 - 30
    state.demand = Math.floor(Math.random() * 21) + 10;
    
    // BƯỚC 1: SẢN XUẤT JIT
    let prodQty = Math.max(0, state.demand - state.laptops);
    if (prodQty > state.components) prodQty = state.components; 
    
    let compAfterProd = state.components - prodQty;
    
    // BƯỚC 2: ĐẶT HÀNG SAFETY STOCK = 30
    let orderQty = 0;
    if (i <= 10) {
        orderQty = Math.max(0, 30 - compAfterProd - state.incomingComponents);
    } else if (i === 11) {
        // Tuần 11 đặt hàng lần cuối để phục vụ cho tuần 12
        orderQty = Math.max(0, 30 - compAfterProd - state.incomingComponents);
    } else if (i === 12) {
        // Tuần 12 (Tuần cuối cùng): KHÔNG đặt hàng nữa để xả tồn kho
        orderQty = 0;
    }

    // Tính toán chi phí
    const totalCost = (orderQty * CONSTANTS.COMP_COST) + (prodQty * CONSTANTS.PROD_COST);
    state.cash -= totalCost;
    
    // Cập nhật tồn kho
    state.components -= prodQty;
    state.laptops += prodQty;

    // Bán hàng
    let sold = Math.min(state.laptops, state.demand);
    let missed = state.demand - sold;
    state.laptops -= sold;
    
    let revenue = sold * CONSTANTS.PRICE;
    state.cash += revenue;

    // Phí lưu kho
    let holdCost = (state.components * CONSTANTS.HOLD_COMP) + (state.laptops * CONSTANTS.HOLD_LAPTOP);
    state.cash -= holdCost;
    
    console.log(`Tuần ${i}: Nhu cầu [${state.demand}]. SX [${prodQty}], Đặt [${orderQty}]. Bán [${sold}]. Kho (LK: ${state.components}, Laptop: ${state.laptops}). Phí Lưu kho: -$${holdCost}. Số dư: $${state.cash}`);

    // Nhận hàng tuần trước
    state.components += state.incomingComponents;
    state.incomingComponents = orderQty;
}

console.log("\n=================================");
console.log(`💰 TỔNG TIỀN MẶT CUỐI CÙNG: $${state.cash}`);
console.log(`📈 LỢI NHUẬN RÒNG: $${state.cash - 10000}`);
console.log("=================================");
