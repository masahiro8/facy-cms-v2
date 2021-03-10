<template>
  <v-container>
    <div class="manage-table-title">時間枠の管理</div>
    <div class="manage-type-table">
      <div class="manage-type-btn">
        <v-btn @click="openNew()">新しい枠を追加する</v-btn>
      </div>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <!-- <th class="manage-type-id text-left">ID</th> -->
              <th class="manage-type-name text-left">名前</th>
              <th class="manage-type-description text-left">説明</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(type, index) in typeIds" :key="type.id">
              <td>{{ type.name }}</td>
              <td>{{ type.description }}</td>
              <td class="text-right">
                <v-icon
                  color="grey"
                  title="編集する"
                  @click="openEdit(index)"
                  >{{ editIcon }}</v-icon
                >
                <v-icon
                  color="grey"
                  title="削除する"
                  @click="removeTypeId(type.id)"
                  >{{ removeIcon }}</v-icon
                >
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <!-- 編集 drawer -->
    <Drawer :toggle="drawerToggle" @close="closeDrawer">
      <ManageTypeIdDetail
        :editIdProp="editId"
        @get-typeids="getTypeids"
        @close-drawer="closeDrawer"
      />
    </Drawer>
  </v-container>
</template>

<script>
import { mdiPencil } from "@mdi/js";
import { mdiDelete } from "@mdi/js";
import Drawer from "../components/Drawer.vue";
import ManageTypeIdDetail from "../components/ManageTypeIdDetail.vue";
import { Typeids } from "../api/api";

export default {
  name: "managetypeids",
  components: { Drawer, ManageTypeIdDetail },
  data: () => {
    return {
      typeIds: [],
      typeName: "",
      typeDescription: "",
      editIcon: mdiPencil,
      removeIcon: mdiDelete,
      drawerToggle: false,
      editId: {},
    };
  },
  mounted() {
    // API get
    this.getTypeids();
  },
  methods: {
    async getTypeids() {
      this.typeIds = await Typeids().get();
      this.typeIds.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          return 1;
        }
      });
    },
    async removeTypeId(id) {
      if (window.confirm("削除してもよろしいですか？")) {
        const param = {
          id: id,
        };
        const result = await Typeids().remove(param);
        console.log("removed", result);
        this.getTypeids();
      }
    },
    openNew() {
      this.editId = {
        name: "",
        description: "",
      };
      this.drawerToggle = true;
    },
    openEdit(index) {
      this.editId = { ...this.typeIds[index] }; // copyして渡す
      this.drawerToggle = true;
    },
    closeDrawer() {
      this.editId = {};
      this.drawerToggle = false;
    },
  },
};
</script>

<style scoped lang="scss">
$table-width: 800px;

.manage-type-add {
  margin-top: 40px;
  .name-input {
    width: 400px;
  }

  .type-name {
    width: 400px;
  }
}

.manage-type-table {
  width: $table-width;
  margin-top: 40px;
  margin-bottom: 40px;

  .manage-type-btn {
    margin-bottom: 24px;
  }

  .manage-type-id {
    width: 160px;
  }

  .manage-type-name {
    width: 200px;
  }

  .manage-type-descripton {
    width: 400px;
  }

  .manage-type-id-table {
    color: #999;
  }
}
</style>