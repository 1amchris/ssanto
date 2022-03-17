import SendType from 'enums/SendType';

export default interface ReceiveData {
  type: SendType;
  data: any;
}
