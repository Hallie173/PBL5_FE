import * as yup from 'yup';

// Định nghĩa schema validation cho form đăng nhập
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu'),
  
  rememberMe: yup
    .boolean()
});

// Giá trị khởi tạo cho form
export const initialFormValues = {
  email: '',
  password: '',
  rememberMe: false
};