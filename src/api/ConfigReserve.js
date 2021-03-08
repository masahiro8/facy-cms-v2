import firebase from "firebase";
//json
//https://github.com/masahiro8/facy-cms-v2/blob/main/public/json/config_schedule.json

const config_reserves_format = {
  day_of_week: {
    Monday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
    Tuesday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
    Wednesday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
    Thursday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
    Friday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
    Saturday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
    Sunday: {
      active: true,
      start_time: "10:00",
      end_time: "11:00",
      time: "30",
      detail: [
        {
          timeid: 1,
          active: true,
          start: "10:00",
          end: "10:30",
        },
        {
          timeid: 2,
          active: true,
          start: "10:30",
          end: "11:00",
        },
      ],
    },
  },
  date: {
    "2020": {
      "01": {
        "01": {
          active: true,
          detail: [
            {
              timeid: 1,
              active: true,
              start: "10:00",
              end: "10:30",
            },
            {
              timeid: 2,
              active: true,
              start: "10:30",
              end: "11:00",
            },
          ],
        },
      },
    },
  },
};

export const ConfigReserve = () => {
  const db = firebase.database();

  const init = () => {
    return new Promise((resolved) => {
      db.ref("/config_reserves").set(config_reserves_format, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
    });
  };

  //日付パスを作成
  const getResevePath = (datearray, path) => {
    const key = datearray.shift();
    if (key) {
      path = `${path}/${key}`;
      return getResevePath(datearray, path);
    } else {
      return path;
    }
  };

  //全件
  const get = () => {
    return new Promise((resolved) => {
      const ref = db.ref("/config_reserves");
      ref.on("value", (snapshot) => {
        const _values = snapshot.val();
        resolved(_values);
      });
    });
  };

  //日付で取得
  const getDate = ({ year, month, day }) => {
    const path = getResevePath([year, month, day], "/config_reserves/date");
    return new Promise((resolved) => {
      const ref = db.ref(path);
      ref.on("value", (snapshot) => {
        const _values = snapshot.val();
        resolved(_values);
      });
    });
  };

  //週の設定を取得
  const getDayOfWeek = (day) => {
    return new Promise((resolved) => {
      const ref = db.ref(
        day
          ? `/config_reserves/day_of_week/${day}`
          : "/config_reserves/day_of_week"
      );
      ref.on("value", (snapshot) => {
        const _values = snapshot.val();
        resolved(_values);
      });
    });
  };

  //曜日単位で更新
  const updateDayOfWeek = async (params) => {
    return get().then((result) => {
      return setDayOfWeek(params, result)
    })
  };

  const setDayOfWeek = async (params, reserves) => {
    return new Promise((resolved) => {
      const day_of_week = Object.assign(reserves.day_of_week, params);
      db.ref("/config_reserves/day_of_week").set(day_of_week, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
    });
  };

  //日付単位で更新
  const getKeyParam = (datearray, objects) => {
    const key = datearray.pop();
    if (!key) {
      return objects;
    } else {
      return getKeyParam(datearray, { [key]: objects });
    }
  };
  const reqKey = (dateconfig, datearray, path, value) => {
    const key = datearray.shift();
    if (key in dateconfig) {
      path = `${path}/${key}`;
      return reqKey(dateconfig[key], datearray, path, value);
    } else {
      //ここから値を再帰的に作成
      datearray.pop();
      const param = getKeyParam(datearray, value);
      if (!key) {
        // 日付keyがない場合
        return { path, param }
      } else {
        return { path, param: { [key]: param } };       
      }
    }
  };

  const setDate = async ({ year, month, day, params }) => {
    return get().then((reserves) => {
      return setOneDate({ year, month, day, params, reserves })
    })
  };

  const setOneDate = async ({ year, month, day, params, reserves }) => {
    console.log("params = ", params);
    return new Promise((resolved) => {
      //再帰的に登録できるキーを抽出
      const { path, param } = reqKey(
        { ...reserves.date },
        [year, month, day],
        "/config_reserves/date",
        params
      );
      console.log("path = ", path, param);
      db.ref(path).update(param, (error) => {
        if (error) {
          resolved({ result: false, error });
        } else {
          resolved({ result: true });
        }
      });
    });
  };

  return {
    init,
    get,
    getDate,
    getDayOfWeek,
    updateDayOfWeek,
    setDate,
  };
};
