import firebase from "firebase";
import { encrypt } from "./util/Encrypt.js";
import { ConfigReserve } from "./ConfigReserve.js";
import { DAY_OF_WEEK } from "./statics.js";
import { Typeids } from "./api.js";

/*
{
  "id": 10001,
  "date": "2020-01-24",
  "date_yyyy": "2020",
  "date_yyyymm": "202001",
  "date_yyyymmdd": "20200124",
  "start_time": "10:30",
  "start_time_hour": "10",
  "start_time_day": "30",
  "end_time": "11:00",
  "end_time_hour": "11",
  "end_time_day": "00",
  "user_mail": "xxx@xxx.com",
  "video_user_id": "SvvmjuyusZJa4fpv",
  "video_cms_id": "fJFhH6m1miG9jcsE"
}
 */

export const Reserves = () => {
  const db = firebase.database();

  /**
   *予約一覧を取得
   * {yyyy, mm, dd} 形式で絞り込み
   * 全てnullの場合は全件取得
   * @param {string*null} year //"01"とか２桁の文字列
   * @param {string*null} month //"01"とか２桁の文字列
   * @param {string*null} day //"01"とか２桁の文字列
   */
  const getReserves = ({ year, month, day }) => {
    return new Promise((resolved) => {
      let ref = null;
      if (year && !month && !day) {
        ref = db
          .ref("/reserves")
          .orderByChild("date_yyyy")
          .equalTo(`${year}`);
      } else if (year && month && !day) {
        ref = db
          .ref("/reserves")
          .orderByChild("date_yyyymm")
          .equalTo(`${year}${month}`);
      } else if (year && month && day) {
        ref = db
          .ref("/reserves")
          .orderByChild("date_yyyymmdd")
          .equalTo(`${year}${month}${day}`);
      } else {
        ref = db.ref("/reserves");
      }

      ref.on("value", (snapshot) => {
        const _reserves = snapshot.val()

        if (_reserves == null) { return resolved([]) } //予約なし時

        const reserves = Object.keys(_reserves)
          .filter((key) => {
            return (
              !("delete" in _reserves[key]) || _reserves[key].delete === false
            );
          })
          .map((key) => {
            return {
              date: _reserves[key].date,
              end_time: _reserves[key].end_time,
              id: _reserves[key].id,
              start_time: _reserves[key].start_time,
              user_mail: _reserves[key].user_mail,
              delete: _reserves[key].delete,
              type_id: _reserves[key].type_id || 0,
            };
          });
        resolved(reserves);
      });
    });
  };


  /**
  * 予約可能な時間帯を枠ごとに返す
  * 空きがない枠は返さない
  * @param {string*null} year //"01"とか２桁の文字列
  * @param {string*null} month //"01"とか２桁の文字列
  * @param {string*null} day //"01"とか２桁の文字列
  */
  const getReservableTime = async ({ year, month, day }) => {
    //曜日設定から取得
    const getFreeTimeFrameFromConfigDayOfWeek = async ({
      year,
      month,
      day,
      currentReserve,
    }) => {
      const _date = new Date(+year, +month - 1, +day);
      const day_index = _date.getDay();
      const weeks = Object.values(DAY_OF_WEEK);
      //曜日を特定
      const _day = weeks.find((d) => {
        return d.index === day_index;
      });

      //曜日設定を取得
      const configDayOfWeek = await ConfigReserve().getDayOfWeek(_day.id);
      if (!configDayOfWeek.active) return null;

      //予約がない場合
      if (!currentReserve) return configDayOfWeek.detail;

      //絞り込み
      return configDayOfWeek.detail.filter((time_frame) => {
        const reserved = currentReserve.find((reserve) => {
          return time_frame.active && time_frame.start === reserve.start_time;
        });
        return !reserved;
      });
    };

    const getFreeTimeFrameFromConfigDate = async ({
      year,
      month,
      day,
      currentReserve,
    }) => {
      //日付設定を取得
      const configDate = await ConfigReserve().getDate({
        year,
        month,
        day,
      });

      //ない、もしくは非アクティブ
      if (!configDate || !configDate.active) return null;

      //予約がない場合
      if (!currentReserve) return configDate.detail;

      //絞り込み
      return configDate.detail.filter((time_frame) => {
        const reserved = currentReserve.find((reserve) => {
          return time_frame.active && time_frame.start === reserve.start_time;
        });
        return !reserved;
      });
    };

    // 時間枠idを取得
    const _typeids = await Typeids().get();
    const typeidsIds = _typeids.map(type => {
      return type.id
    });

    //予約状況を取得
    const _reserves = await getReserves({
      year,
      month,
      day,
    });

    const getFreeTimeFrameByTypeid = async (typeid) => {
      // 予約データをtype_idでfilter
      const currentReserve = _reserves.filter(reserve => {
        return reserve.type_id == typeid
      })

      //日付から取得
      const free_time_frame_date = await getFreeTimeFrameFromConfigDate({
        year,
        month,
        day,
        currentReserve,
      });

      //曜日設定から取得
      const free_time_frame_day = await getFreeTimeFrameFromConfigDayOfWeek({
        year,
        month,
        day,
        currentReserve,
      });

      let free_time_frame = free_time_frame_date || free_time_frame_day;

      // 空き時間帯がない枠のデータを返さない
      const free_time_frame_numbers = free_time_frame.filter(frame => {
        return frame.active;
      }).length;
      if (free_time_frame_numbers < 1) { return false }

      return new Promise((resolved) => {
        resolved({
          active: free_time_frame ? true : false,
          detail: free_time_frame,
        });
      });
    }

    // 時間枠ごとに予約可能時間帯を取得
    return new Promise((resolved) => {
      let free_time_frames_by_typeid = {}
      typeidsIds.forEach(typeid => {
        getFreeTimeFrameByTypeid(typeid).then((result) => {
          if (result) {
            free_time_frames_by_typeid[typeid] = result
          }
        })
      });

      // console.log("free_time_frames_by_typeid", free_time_frames_by_typeid)
      resolved(free_time_frames_by_typeid);
    });
  };

  /**
   * 予約を登録
   * @param {string} date 日付形式 2020-12-31
   * @param {string} start_time 時間形式 10:30
   * @param {string} end_time 時間形式 10:30
   * @param {string} user_mail メール
   * @param {number} type_id 枠のid
   */
  const setNewReserve = ({
    reserve_date,
    start_time,
    end_time,
    email,
    type_id,
  }) => {
    return new Promise((resolved) => {
      const _reserve_date = `${reserve_date}`.split("-");
      const _date = new Date(
        _reserve_date[0],
        _reserve_date[1],
        _reserve_date[2]
      );
      const id = encrypt(_date.getTime());
      const params = {
        id: id,
        date: reserve_date,
        date_yyyy: _reserve_date[0],
        date_yyyymm: `${_reserve_date[0]}${_reserve_date[1]}`,
        date_yyyymmdd: `${_reserve_date[0]}${_reserve_date[1]}${_reserve_date[2]}`,
        start_time,
        start_time_hour: start_time.split(":")[0],
        start_time_day: start_time.split(":")[1],
        end_time,
        end_time_hour: end_time.split(":")[0],
        end_time_day: end_time.split(":")[1],
        user_mail: email,
        delete: false,
        type_id: type_id || 0, //単に予約だけでなく別の属性を設定する場合に仕様 例) 部屋A = 1, 部屋B = 2
      };
      db.ref("reserves/" + id).set(params, (error) => {
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
   * 予約を登録
   * @param {string} date 日付形式 2020-12-31
   * @param {string} start_time 時間形式 10:30
   * @param {string} end_time 時間形式 10:30
   * @param {string} user_mail メール
   * @param {number} type_id 枠のid
   */
  const updateReserve = ({
    id,
    reserve_date,
    start_time,
    end_time,
    email,
    type_id,
  }) => {
    console.log(
      "updateReserve",
      id,
      reserve_date,
      start_time,
      end_time,
      email,
      type_id
    );
    return new Promise((resolved) => {
      const _reserve_date = `${reserve_date}`.split("-");
      const params = {
        date: reserve_date,
        date_yyyy: _reserve_date[0],
        date_yyyymm: `${_reserve_date[0]}${_reserve_date[1]}`,
        date_yyyymmdd: `${_reserve_date[0]}${_reserve_date[1]}${_reserve_date[2]}`,
        start_time,
        start_time_hour: start_time.split(":")[0],
        start_time_day: start_time.split(":")[1],
        end_time,
        end_time_hour: end_time.split(":")[0],
        end_time_day: end_time.split(":")[1],
        user_mail: email,
        type_id: type_id || 0,
      };
      db.ref("reserves/" + id).update(params, (error) => {
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

  const deleteReserve = ({ id }) => {
    return new Promise((resolved) => {
      db.ref("reserves/" + id).update({ delete: true }, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
    });
  };

  return {
    getReserves,
    setNewReserve,
    updateReserve,
    deleteReserve,
    getReservableTime,
  };
};
