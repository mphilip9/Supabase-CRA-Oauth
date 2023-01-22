const validatePwd = (pwd) => {
  const numbers = /\d/;
  const specialRegex = /[^a-zA-Z0-9\s\:]/;
  const capitalLetters = /[A-Z]/;
  if (
    pwd.length > 8 &&
    pwd.match(numbers) &&
    pwd.match(specialRegex) &&
    pwd.match(capitalLetters)
  ) {
    return true;
  } else {
    return false;
  }
};

export default validatePwd;
