<template>
  <div class="acount-container">
    <!-- 役職選択 -->
    <v-container fluid class="account">
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            :items="items"
            item-text="label"
            item-value="value"
            @change="onChange($event)"
            filled
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!-- 招待ボタン -->
    <v-btn elevation="2" large class="invite-btn">招待</v-btn>

    <!-- テーブル -->
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">権限</th>
            <th class="text-left">名前</th>
            <th class="text-left">メールアドレス</th>
            <!-- 編集アイコン用 -->
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in accountInfo" :key="item.name">
            <td>{{ item.roll_label }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>
              <v-btn icon @click="clickedEditIcon(item)" class="edit-icon">
                <v-icon>{{ editIcon }}</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
  import { Users } from "@/api/users";
  import { mdiPencil } from "@mdi/js";

  export default {
    data: () => ({
      items: [
        { label: "管理者", value: "admin" },
        { label: "マーケター", value: "marketer" },
        { label: "サポーター", value: "support" },
      ],
      accountInfo: [],
      tempItems: [],
      editIcon: mdiPencil,
    }),
    mounted() {
      Users()
        .getUsers()
        .then((users) => {
          const userItem = users.map((user) => {
            let userInfo = {};
            switch (user.roll) {
              case "admin":
                userInfo.roll_label = "管理者";
                break;
              case "marketer":
                userInfo.roll_label = "マーケター";
                break;
              case "support":
                userInfo.roll_label = "サポーター";
                break;
              default:
                userInfo.roll_label = "";
                break;
            }
            userInfo.roll_value = user.roll;
            userInfo.name = user.username;
            userInfo.email = user.email;
            userInfo.uid = user.uid;
            return userInfo;
          });
          this.accountInfo = userItem;
          this.tempItems = userItem;
        })
        .catch((reject) => {
          console.log(reject);
        });
    },
    methods: {
      onChange(value) {
        this.accountInfo = this.tempItems;
        if (this.accountInfo.length !== 0) {
          const rollFiltered = this.accountInfo.filter(
            (item) => item.roll_value === value
          );
          this.accountInfo = rollFiltered;
        }
      },
      clickedEditIcon(item) {
        this.$router.push({
          name: "UpdateProfile",
          params: { accountInfo: item },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .acount-container {
    .account {
      margin-top: 40px;
    }

    .invite-btn {
      margin: 10px 0 40px 10px;
    }

    .edit-icon {
      margin-top: 4px;
    }
  }
</style>
