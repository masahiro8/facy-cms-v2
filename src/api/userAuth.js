import firebase from "firebase";

//ユーザー管理
//https://firebase.google.com/docs/auth/web/manage-users?hl=ja

//書き込み/呼び出し
//https://firebase.google.com/docs/database/web/read-and-write#basic_write

//パスワード再設定メール
//https://firebase.google.com/docs/auth/web/email-link-auth?hl=ja

const getUserParam = (_user) => {
  return {
    name: _user.displayName,
    email: _user.email,
    emailVerified: _user.emailVerified,
    uid: _user.uid, // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
  };
};

export const UserAuth = () => {
  const auth = firebase.auth();
  const db = firebase.database();
  let user_profile = {};
  let user_idtoken = null;

  const signup = ({ email, password, name, roll }) => {
    return new Promise((resolved) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(async () => {
          const _user = auth.currentUser;
          const user_param = getUserParam(_user);
          user_idtoken = await getIdToken();
          setUserProfile({
            uid: user_param.uid,
            token: user_idtoken,
            email: _user.email,
            name,
            roll,
          });
          resolved({
            result: true,
            user: user_param,
          });
        })
        .catch((error) => {
          resolved({
            result: false,
            error,
          });
        });
    });
  };
  const login = ({ email, password }) => {
    return new Promise((resolved) => {
      auth.signInWithEmailAndPassword(email, password).then(
        async () => {
          user_profile = await getLoggedinUserProfileOnce();
          resolved({
            result: true,
            user: user_profile,
          });
        },
        (error) => {
          resolved({
            result: false,
            error,
          });
        }
      );
    });
  };

  const logout = () => {
    return new Promise((resolved) => {
      auth
        .signOut()
        .then(() => {
          resolved({ result: true });
        })
        .catch((error) => {
          // console.log(`ログアウト時にエラーが発生しました (${error})`);
          resolved({ result: false, error });
        });
    });
  };

  /**
   * トークンを取得
   */
  const getIdToken = () => {
    return new Promise((resolved) => {
      auth.currentUser
        .getIdToken(/* forceRefresh */ true)
        .then((idToken) => {
          resolved(idToken);
        })
        .catch((error) => {
          console.log(error);
          resolved(null);
        });
    });
  };

  /**
   *
   * ユーザー情報を登録
   * @param {String} uid
   * @param {String} token
   * @param {String} name
   * @param {String} roll
   */
  const setUserProfile = ({ uid, token, name, roll, email }) => {
    db.ref("users/" + uid).set({
      uid,
      username: name,
      token,
      roll,
      email,
    });
  };

  /**
   * ログインしているユーザーを取得
   * ログインしていない場合はnullを返す
   *
   * @return {
   * name,
   * email,
   * emailVerified,
   * uid
   * }
   */
  const getLoggedinUserProfileOnce = () => {
    return new Promise((resolved) => {
      const user = auth.currentUser;
      if (!user) {
        //未ログイン
        resolved(null);
      } else {
        let user_param = getUserParam(user);
        db.ref("/users/" + user.uid)
          .once("value")
          .then((snapshot) => {
            user_param = Object.assign(user_param, {
              username: snapshot.val().username,
              roll: snapshot.val().roll,
            });
            resolved(user_param);
          })
          .catch((error) => {
            console.error(error);
            resolved(null);
          });
        // const snapshot = db.ref("/users/" + user.uid).once("value");
        // if (snapshot.val()) {
        //   user_param = Object.assign(user_param, {
        //     username: snapshot.val().username,
        //     roll: snapshot.val().roll,
        //   });
        //   resolved(user_param);
        // } else {
        //   resolved(null);
        // }
      }
    });
  };

  /**
   *
   * アプリ起動時にログイン状態を確認する
   *
   */
  const getLoggedinUserProfile = async () => {
    return new Promise((resolved) => {
      auth.onAuthStateChanged(() => {
        const user_profile = getLoggedinUserProfileOnce();
        if (user_profile) {
          resolved(user_profile);
        } else {
          resolved(null);
        }
      });
    });
  };

  /**
   * パスワードリセットメールを送信
   *
   * Firebaseコンソールの Settings > General > Public settingsの中を設定する
   *
   * Public-facing name > アプリ名
   * Support email  > 返信先メール
   *
   */
  const sendPasswordResetEmail = ({ email }) => {
    return new Promise((resolved) => {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          resolved({ result: true });
        })
        .catch((error) => {
          resolved({ result: false, error });
        });
    });
  };

  return {
    signup,
    login,
    logout,
    getLoggedinUserProfile,
    sendPasswordResetEmail,
  };
};
