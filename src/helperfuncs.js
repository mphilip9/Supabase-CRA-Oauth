export const validatePwd = (pwd) => {
  let hazardColor = "red";
  let checkedColor = "green";
  // Have to use the actual symbols rather than character codes because React converts variables to protect against XSS attacks
  let hazardSign = "⚠";
  let checkMark = "✓";
  const numbers = /\d/;
  const specialRegex = /[^a-zA-Z0-9\s\:]/;
  const capitalLetters = /[A-Z]/;
  let validatedObject = {
    length: [hazardColor, hazardSign],
    number: [hazardColor, hazardSign],
    special: [hazardColor, hazardSign],
    capital: [hazardColor, hazardSign],
  };
  if (pwd.length >= 8) {
    validatedObject.length = [checkedColor, checkMark];
  }
  if (pwd.match(numbers)) {
    validatedObject.number = [checkedColor, checkMark];
  }
  if (pwd.match(specialRegex)) {
    validatedObject.special = [checkedColor, checkMark];
  }
  if (pwd.match(capitalLetters)) {
    validatedObject.capital = [checkedColor, checkMark];
  }
  return validatedObject;
};

// check if password meets all requirements on submit
export const validateSubmitPwd = (pwdObject) => {
  for (const prop in pwdObject) {
    if (prop[1] === "⚠") {
      return false;
    }
  }
  return true;
};
