// EasyPOS demo data
window.EP_PRODUCTS = [
  { id: 1, name: "Iphone 17 Promax", unit: "Chiếc", price: 30000, oldPrice: 35000, stock: 125, promo: "Mua 2 tặng 1", warranty: "12 tháng" },
  { id: 2, name: "Áo thun OWL trắng", unit: "Chiếc", price: 199000, oldPrice: 250000, stock: 84, promo: "Mua 2 tặng 1", warranty: "" },
  { id: 3, name: "Quần jean nam slim", unit: "Chiếc", price: 459000, oldPrice: null, stock: 42, promo: "", warranty: "" },
  { id: 4, name: "Áo sơ mi Oxford", unit: "Chiếc", price: 329000, oldPrice: 380000, stock: 60, promo: "", warranty: "" },
  { id: 5, name: "Khăn quàng cổ nữ OWL", unit: "Chiếc", price: 89000, oldPrice: null, stock: 210, promo: "Quà tặng", warranty: "" },
  { id: 6, name: "Mũ lưỡi trai basic", unit: "Chiếc", price: 120000, oldPrice: 150000, stock: 95, promo: "", warranty: "" },
  { id: 7, name: "Giày sneaker trắng", unit: "Đôi", price: 690000, oldPrice: 790000, stock: 33, promo: "Mua 2 tặng 1", warranty: "6 tháng" },
  { id: 8, name: "Túi tote canvas", unit: "Chiếc", price: 149000, oldPrice: null, stock: 120, promo: "", warranty: "" },
  { id: 9, name: "Áo khoác gió 2 lớp", unit: "Chiếc", price: 549000, oldPrice: 620000, stock: 28, promo: "", warranty: "" },
  { id: 10, name: "Thắt lưng da nam", unit: "Chiếc", price: 259000, oldPrice: null, stock: 47, promo: "", warranty: "" },
  { id: 11, name: "Vớ cotton (combo 5)", unit: "Bộ", price: 99000, oldPrice: 130000, stock: 300, promo: "Mua 2 tặng 1", warranty: "" },
  { id: 12, name: "Kính mát thời trang", unit: "Chiếc", price: 219000, oldPrice: null, stock: 65, promo: "", warranty: "" },
];

window.EP_CATEGORIES = ["Tất cả", "Quần áo", "Áo", "Quần", "Áo sơ mi", "Khăn", "Mũ", "Giày"];

window.epFormat = (n) => n.toLocaleString("vi-VN");
