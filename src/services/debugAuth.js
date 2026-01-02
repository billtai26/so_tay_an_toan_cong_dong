// Script để kiểm tra authentication (đã tắt logs)
const debugAuth = () => {
  // Kiểm tra localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (userStr) {
    try {
      const user = JSON.parse(userStr);

      // Logic kiểm tra isAdmin
      const isAdmin = user && user.role === 'admin';

      // Trả về kết quả thay vì log ra console
      return {
        isAuthenticated: !!token,
        user,
        isAdmin,
        status: isAdmin ? 'Admin access' : 'Regular user'
      };
    } catch (e) {
      return { error: 'Error parsing user data', message: e.message };
    }
  }

  return {
    isAuthenticated: !!token,
    user: null,
    isAdmin: false,
    status: 'No user data'
  };
};

// Thực thi hàm (không còn in gì ra console)
debugAuth();

// Expose cho browser console (có thể gọi window.debugAuth() để xem kết quả trả về)
window.debugAuth = debugAuth;

// Export cho ESM imports
export { debugAuth };