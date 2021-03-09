import firebase from "firebase";
import { encrypt } from "./util/Encrypt.js";

/*
{
  "id": 1615267531079, // unix time
  "name": "20文字までのテキスト",
  "description": "20文字までのテキスト",
}
 */

export const Typeids = () => {
  const db = firebase.database();

  /**
   *枠一覧を取得
   */
  const get = () => {
    return new Promise((resolved) => {
      let ref = null;
      ref = db.ref("/type_ids");

      ref.on("value", (snapshot) => {
        const _typeids = snapshot.val();
        const typeids = Object.keys(_typeids)
          .filter((key) => {
            return (
              !("delete" in _typeids[key]) || _typeids[key].delete === false
            );
          })
          .map((key) => {
            return {
              id: _typeids[key].id,
              name: _typeids[key].name,
              description: _typeids[key].description,
              delete: _typeids[key].delete,
            };
          });
        resolved(typeids);
      });
    });
  };

  /**
   * 枠を登録
   * @param {number} id unix time
   * @param {string} name 枠の名前
   * @param {string} description 枠の説明
   */
  const create = ({
    name,
    description,
  }) => {
    return new Promise((resolved) => {
      const id = encrypt(new Date().getTime());
      const params = {
        id: id,
        name: name,
        description: description,
        delete: false,
      };
      db.ref("type_ids/" + id).set(params, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
      // console.log(params);
      resolved(params);
    });
  };

  /**
   * 枠を更新
   * @param {number} id unix time
   * @param {string} name 枠の名前
   * @param {string} description 枠の説明
   */
  const update = ({
    id,
    name,
    description,
  }) => {
    console.log(
      "updateTypeid",
      id,
      name,
      description,
    );
    return new Promise((resolved) => {
      const params = {
        id: id,
        name: name,
        description: description,
        delete: false,
      };
      db.ref("type_ids/" + id).update(params, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
      // console.log(params);
      resolved(params);
    });
  };

  const remove = ({ id }) => {
    return new Promise((resolved) => {
      db.ref("type_ids/" + id).update({ delete: true }, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
    });
  };

  return {
    get,
    create,
    update,
    remove,
  };
};
