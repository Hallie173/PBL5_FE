import * as yup from "yup";

export const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Vui lòng nhập họ và tên")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự"),

  username: yup
    .string()
    .required("Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    ),

  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),

  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số"
    ),

  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

// Giá trị khởi tạo cho form
export const initialFormValues = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};
