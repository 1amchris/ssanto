namespace ValidatorsUtils {
  export const required = {
    assert: (value: any) => value || value === 0 || value === false,
    message: (value: string) => `Required`,
  };

  export const email = {
    assert: (value: string) =>
      value.length === 0 ||
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
    message: (value: string) => `Invalid value: ${value} is not a valid email.`,
  };

  export const url = {
    assert: (value: string) =>
      value.length === 0 ||
      /^(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
        value
      ),
    message: (value: string) =>
      `Invalid value: ${value} is not a valid website.`,
  };
}

export default ValidatorsUtils;
