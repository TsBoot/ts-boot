
import axios from "../base";
async function getBilibiliRoomInfo (id : number) : Promise<any> {
  const url = "/room/v1/Room/room_init?id=" + id;
  return (await axios.get(url)).data;
}

export default getBilibiliRoomInfo;
