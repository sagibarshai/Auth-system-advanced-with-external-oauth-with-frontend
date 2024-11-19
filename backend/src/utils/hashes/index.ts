import bcrypt from "bcryptjs";

export const toHash = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const compereHash = (hashed: string, notHashed: string): boolean => {
  const isEqual = bcrypt.compareSync(notHashed, hashed);
  return isEqual;
};
