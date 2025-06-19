// import { useTranslation } from "react-i18next";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import moment from "moment";

export const phoneNumberValidation = (userData, t, countryCode) => {
  let errors = {};
  let isValid = true;
  const phoneNumber = parsePhoneNumberFromString(
    userData?.phone_no,
    countryCode
  );
  if (userData?.phone_no !== undefined) {
    if (phoneNumber !== undefined && !phoneNumber) {
      errors.phone_no = t("required");
      isValid = false;
    } else if (!phoneNumber?.isValid()) {
      errors.phone_no = t("phone_number_is_not_valid");
      isValid = false;
    } else if (userData?.phone_no) {
      errors.phone_no = "";
    }
  }

  return { errors, isValid };
};

export const LoginFormValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,16})"
  );
  if (userData?.email !== undefined && !userData?.email) {
    errors.email = t("required");
    isValid = false;
  } else if (
    userData?.email !== undefined &&
    !emailregex.test(userData?.email)
  ) {
    errors.email = t("please_enter_valid_email");
    isValid = false;
  } else if (userData?.email) {
    errors.email = "";
  }

  if (userData.password !== undefined && !userData.password) {
    errors.password = t("required");
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  return { errors, isValid };
};

export const forgotValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;

  if (userData?.email !== undefined && !userData?.email) {
    errors.email = t("required");
    isValid = false;
  } else if (
    userData?.email !== undefined &&
    !emailregex.test(userData?.email)
  ) {
    errors.email = t("please_enter_valid_email");
    isValid = false;
  } else if (userData?.email) {
    errors.email = "";
  }

  return { errors, isValid };
};

export const SignUpFormValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  let capitalRegex = /^[a-zA-Z\s]*$/;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).{8,16}$"
  );

  if (userData.full_name !== undefined && !userData.full_name) {
    errors.full_name = t("required");
    isValid = false;
  } else if (
    userData.full_name !== undefined &&
    !capitalRegex.test(userData?.full_name)
  ) {
    errors.full_name = t("full_name_cannot_contain_numbers");
    isValid = false;
  } else if (userData?.full_name) {
    errors.full_name = "";
  }

  if (userData?.email !== undefined && !userData?.email) {
    errors.email = t("required");
    isValid = false;
  } else if (
    userData?.email !== undefined &&
    !emailregex.test(userData?.email)
  ) {
    errors.email = t("please_enter_valid_email");
    isValid = false;
  } else if (userData?.email) {
    errors.email = "";
  }

  if (userData.password !== undefined && !userData.password) {
    errors.password = t("required");
    isValid = false;
  } else if (
    userData.password !== undefined &&
    !PasswordRegex.test(userData.password)
  ) {
    errors.password = t("pmbetsclamcaloscauclcl");
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  if (userData.confirm_password !== undefined && !userData.confirm_password) {
    errors.confirm_password = t("required");
    isValid = false;
  } else if (
    userData.confirm_password !== undefined &&
    userData.confirm_password !== userData.password
  ) {
    errors.confirm_password = t("passwords_do_not_match");
    isValid = false;
  } else if (userData.confirm_password) {
    errors.confirm_password = "";
  }

  return { errors, isValid };
};

export const MatchPasswordValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,16})"
  );

  if (userData.password !== undefined && !userData.password) {
    errors.password = t("required");
    isValid = false;
  } else if (
    userData.password !== undefined &&
    !PasswordRegex.test(userData.password)
  ) {
    errors.password = t("pmbetsclamcaloscauclcl");
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  return { errors, isValid };
};


export const ChangePasswordValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  let capitalRegex = /^[a-zA-Z\s]*$/;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).{8,16}$"
  );
  if (userData.new_password !== undefined && !userData.new_password) {
    errors.new_password = t("required");
    isValid = false;
  } else if (
    userData.new_password !== undefined &&
    !PasswordRegex.test(userData.new_password)
  ) {
    errors.new_password = t("pmbetsclamcaloscauclcl");
    isValid = false;
  } else if (userData.new_password) {
    errors.new_password = "";
  }

  if (userData.confirm_password !== undefined && !userData.confirm_password) {
    errors.confirm_password = t("required");
    isValid = false;
  } else if (
    userData.confirm_password !== undefined &&
    userData.confirm_password !== userData.new_password
  ) {
    errors.confirm_password = t("passwords_do_not_match");
    isValid = false;
  } else if (userData.confirm_password) {
    errors.confirm_password = "";
  }

  return { errors, isValid };
};

export const CRNFormValidation = (userData, t, countryCode) => {
  let errors = {};
  let isValid = true;
  let numberRegex = /^[0-9]*$/;


  if (userData.pdf !== undefined && !userData.pdf) {
    errors.pdf = t("required");
    isValid = false;
  } else if (userData?.pdf) {
    errors.pdf = "";
  }

  if (userData.business_code !== undefined && !userData.business_code) {
    errors.business_code = t("required");
    isValid = false;
  } else if (userData?.business_code) {
    errors.business_code = "";
  }
  if (userData.owner_id !== undefined && !userData.owner_id) {
    errors.owner_id = t("required");
    isValid = false;
  } else if (userData?.owner_id) {
    errors.owner_id = "";
  }
  if (userData.expiry_date !== undefined && !userData.expiry_date) {
    errors.expiry_date = t("required");
    isValid = false;
  } else if (userData?.expiry_date) {
    errors.expiry_date = "";
  }

  if (userData.cr_number !== undefined && !userData.cr_number) {
    errors.cr_number = t("required");
    isValid = false;
  } else if (
    userData.cr_number !== undefined &&
    !numberRegex.test(userData?.cr_number)
  ) {
    errors.cr_number = t("required");
    isValid = false;
  } else if (userData?.cr_number) {
    errors.cr_number = "";
  }

  return { errors, isValid };
};


export const ProfileValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  let capitalRegex = /^[a-zA-Z\s]*$/;

  if (userData.profile_pic !== undefined && !userData.profile_pic) {
    errors.profile_pic = t("profile_is_required");
    isValid = false;
  } else if (userData?.profile_pic) {
    errors.profile_pic = "";
  }

  if (userData.full_name !== undefined && !userData.full_name) {
    errors.full_name = t("required");
    isValid = false;
  } else if (
    userData.full_name !== undefined &&
    !capitalRegex.test(userData?.full_name)
  ) {
    errors.full_name = t("full_name_cannot_contain_numbers");
    isValid = false;
  } else if (userData?.full_name) {
    errors.full_name = "";
  }

  return { errors, isValid };
};

export const ResandPasswordValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,16})"
  );

  if (userData.password !== undefined && !userData.password) {
    errors.password = t("please_enter_valid_email");
    isValid = false;
  } else if (
    userData.password !== undefined &&
    !PasswordRegex.test(userData.password)
  ) {
    errors.password = t("pmbetsclamcaloscauclcl");
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  if (userData.confirm_password !== undefined && !userData.confirm_password) {
    errors.confirm_password = t("please_confirm_password");
    isValid = false;
  } else if (userData.confirm_password !== userData.password) {
    errors.confirm_password = t("passwords_do_not_match");
    isValid = false;
  } else {
    errors.confirm_password = "";
  }

  return { errors, isValid };
};

export const CategoryValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  let capitalRegex = /^[a-zA-Z\s]*$/;

  if (userData.name !== undefined && !userData.name) {
    errors.name = t("required");
    isValid = false;
  } else if (userData?.name) {
    errors.name = "";
  }

  return { errors, isValid };
};

export const CatelogFormValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  if (userData?.catelog_images !== undefined && userData.catelog_images.length === 0) {
    errors.catelog_images = t("required");
    isValid = false;
  } else if (userData?.catelog_images !== undefined && userData.catelog_images.length < 2) {
    errors.catelog_images = `${t("min_Add_product")} 2 ${t("images")}.`;
    isValid = false;
  } else if (userData?.catelog_images !== undefined && userData.catelog_images.length > 4) {
    errors.catelog_images = `${t("max_add_product")} 4 ${t("images")}.`;
    isValid = false;
  } else if (userData?.catelog_images?.length > 0 && userData?.catelog_images?.length < 5) {
    errors.catelog_images = "";
  }

  if (userData.catalog_name !== undefined && !userData.catalog_name) {
    errors.catalog_name = t("required");
    isValid = false;
  } else if (userData?.catalog_name) {
    errors.catalog_name = "";
  }

  if (userData.price !== undefined && !userData.price) {
    errors.price = t("required");
    isValid = false;
  } else if (userData?.price) {
    errors.price = "";
  }

  if (userData.material !== undefined && !userData.material) {
    errors.material = t("required");
    isValid = false;
  } else if (userData?.material) {
    errors.material = "";
  }

  if (userData.quantity !== undefined && !userData.quantity) {
    errors.quantity = t("required");
    isValid = false;
  } else if (userData?.quantity) {
    errors.quantity = "";
  }

  if (
    userData.catalog_description !== undefined &&
    !userData.catalog_description
  ) {
    errors.catalog_description = t("required");
    isValid = false;
  } else if (userData?.catalog_description) {
    errors.catalog_description = "";
  }
  if (
    userData.shopping_information !== undefined &&
    !userData.shopping_information
  ) {
    errors.shopping_information = t("required");
    isValid = false;
  } else if (userData?.shopping_information) {
    errors.shopping_information = "";
  }
  if (userData.color !== undefined && !userData.color) {
    errors.color = t("required");
    isValid = false;
  } else if (userData?.color) {
    errors.color = "";
  }
  if (userData.sku !== undefined && !userData.sku) {
    errors.sku = t("required");
    isValid = false;
  } else if (userData?.sku) {
    errors.sku = "";
  }
  if (userData.return_policy !== undefined && !userData.return_policy) {
    errors.return_policy = t("required");
    isValid = false;
  } else if (userData?.return_policy) {
    errors.return_policy = "";
  }

  return { errors, isValid };
};

export const validateVariant = (variant, t) => {
  const errors = {};
  let isValid = true;

  if (variant?.catalog_img !== undefined && variant.catalog_img.length === 0) {
    errors.catalog_img = t("required");
    isValid = false;
  } else if (variant?.catalog_img !== undefined && variant.catalog_img.length < 2) {
    errors.catalog_img = `${t("min_Add_product")} 2 ${t("images")}.`;
    isValid = false;
  } else if (variant?.catalog_img !== undefined && variant.catalog_img.length > 4) {
    errors.catalog_img = `${t("max_add_product")} 4 ${t("images")}.`;
    isValid = false;
  } else if (variant?.catalog_img) {
    errors.catalog_img = "";
  }
  if (variant.price !== undefined && !variant.price) {
    errors.price = t("required");
    isValid = false;
  } else if (variant?.price) {
    errors.price = "";
  }

  if (variant.color !== undefined && !variant.color) {
    errors.color = t("required");
    isValid = false;
  } else if (variant?.color) {
    errors.color = "";
  }

  return { errors, isValid };
};

export const DesignerServiceFormValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  const now = moment();
  const minSelectableTime = now.add(1, "hours");
  if (userData.price !== undefined && !userData.price) {
    errors.price = t("required");
    isValid = false;
  } else if (userData?.price) {
    errors.price = "";
  }

  if (
    userData.designer_service_category !== undefined &&
    !userData.designer_service_category
  ) {
    errors.designer_service_category = t("required");
    isValid = false;
  } else if (userData?.designer_service_category) {
    errors.designer_service_category = "";
  }

  if (
    userData.designer_service_name !== undefined &&
    !userData.designer_service_name
  ) {
    errors.designer_service_name = t("required");
    isValid = false;
  } else if (userData?.designer_service_name) {
    errors.designer_service_name = "";
  }

  if (
    userData.designer_service_description !== undefined &&
    !userData.designer_service_description
  ) {
    errors.designer_service_description = t("required");
    isValid = false;
  } else if (userData?.designer_service_description) {
    errors.designer_service_description = "";
  }

  if (
    userData.additional_services !== undefined &&
    !userData.additional_services
  ) {
    errors.additional_services = t("required");
    isValid = false;
  } else if (userData?.additional_services) {
    errors.additional_services = "";
  }
  if (
    userData.estimated_delivery_time !== undefined &&
    !userData.estimated_delivery_time
  ) {
    errors.estimated_delivery_time = t("required");
    isValid = false;
  } else if (userData?.estimated_delivery_time) {
    const selectedDateTime = moment(userData.estimated_delivery_time);
    if (selectedDateTime.isBefore(minSelectableTime)) {
      errors.estimated_delivery_time = t("ycosatalohfn");
      isValid = false;
    } else {
      errors.estimated_delivery_time = ""; // Clear previous errors
    }
  }
  return { errors, isValid };
};

export const DisputeFormValidation = (data, t) => {
  let errors = {};
  let isValid = true

  if (data.recent_order !== undefined && !data.recent_order) {
    errors.recent_order = t("required");
    isValid = false
  } else if (data.recent_order) {
    errors.recent_order = ""
  }

  if (data.concern !== undefined && !data.concern) {
    errors.concern = t("required");
    isValid = false
  } else if (data.concern) {
    errors.concern = "";
  }

  if (data.subject !== undefined && !data.subject) {
    errors.subject = t("required");
    isValid = false
  } else if (data.subject) {
    errors.subject = ""
  }

  if (data.message !== undefined && !data.message) {
    errors.message = t("required");
    isValid = false
  } else if (data.message) {
    errors.message = ""
  }

  return { errors, isValid };
};


export const HelpFormValidation = (formData, t) => {
  let errors = {};
  let isValid = true;
  const phoneNumber = parsePhoneNumberFromString(
    `+${formData?.phone}`
  );

  if (formData.name !== undefined && !formData.name.trim()) {
    errors.name = t("required");
    isValid = false;
  } else if (formData.name) {
    errors.name = "";
  }

  if (formData.email !== undefined && !formData.email.trim()) {
    errors.email = t("required");
    isValid = false;
  } else if (
    formData.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
  ) {
    errors.email = t("please_enter_valid_email");
    isValid = false;
  } else if (formData.email) {
    errors.email = "";
  }

  if (formData.message !== undefined && !formData.message.trim()) {
    errors.message = t("required");
    isValid = false;
  } else if (formData.message) {
    errors.message = "";
  }

  return { errors, isValid };
};

export const BussinessTypeValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  if (userData.business_name !== undefined && !userData.business_name) {
    errors.business_name = t("required");
    isValid = false;
  } else if (userData?.business_name) {
    errors.business_name = "";
  }

  if (userData.business_code !== undefined && !userData.business_code) {
    errors.business_code = t("required");
    isValid = false;
  } else if (userData?.business_code) {
    errors.business_code = "";
  }

  return { errors, isValid };
};


export const ServiceRequestFormValidation = (data, t) => {
  let errors = {};
  let isValid = true;

  if (data.service !== undefined && !data.service) {
    errors.service = t("required");
    isValid = false;
  } else if (data?.service) {
    errors.service = "";
  }

  if (data.message !== undefined && !data.message.trim()) {
    errors.message = t("required");
    isValid = false;
  } else if (data.message) {
    errors.message = "";
  }

  return { errors, isValid };
};

