
export default class UserModel {
  constructor(name, email, password, type, id) {
    this._id = id; 
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }
}