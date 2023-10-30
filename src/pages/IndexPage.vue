<template>
  <div>
    <div class="section1">
      <q-list bordered class="rounded-borders">
        <q-expansion-item header-class="bg-primary text-white" expand-icon-class="text-white">
          <template v-slot:header>
            <q-item-section>查詢條件</q-item-section>
          </template>

          <q-card>
            <q-card-section class="bg-white">
              <q-input filled bottom-slots v-model="title" label="請輸入標題" class="titleInput">
                <template v-slot:before>
                  <p>標題</p>
                </template>
                <template v-slot:append>
                  <q-icon v-if="title !== ''" name="close" @click="title = ''" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="bg-grey-3 titleBtns">
              <q-btn class="bg-light-blue-6 text-white" @click="filterAds"><q-icon name="search" />查詢</q-btn>
              <q-btn class="bg-green-5 text-white" @click="showAddDialog = true"><q-icon name="add" />新增</q-btn>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  <!-- 表格 -->
  <div class="section2">
      <q-table :rows="adsStore.getAds" :columns="columns">
        <template v-slot:body-cell-image="{ row }">
          <q-td class="text-center">
            <img :src="row.image" height="50" alt="廣告圖片" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="{ row }">
          <q-td class="text-center">
            <q-btn outlined icon="edit" @click="editAd(row)" color="primary"/>
          </q-td>
        </template>
      </q-table>
    </div>
<!-- 彈窗 -->
    <q-dialog v-model="showAddDialog">
      <q-card class="q-pa-sm dialogCard">
        <q-card-title ><p v-if="isEditing">{{ '修改資訊' }}</p><p v-else>{{ '新增資訊' }}</p></q-card-title>

        <q-card-section class="row  ">

          <q-input filled v-model="newAd.title" label="廣告標題" class="col-6  q-pa-xs"    :rules="[val => !!val || '請輸入廣告標題']"/>
          <q-select filled v-model="newAd.status" :options="statusOptions" label="廣告狀態"  class="col-6 q-pa-xs" :rules="[val => !!val || '請選擇廣告狀態']"/></q-card-section>
        <q-card-section class="row  ">
          <q-input filled v-model="newAd.link" label="廣告連結"  class="col-12  q-pa-xs"/></q-card-section>
          <q-card-section class="row  ">
  <div class="col-12  q-pa-xs">

    <div class="custom-file-upload">
      <p>廣告圖片</p>
      <div v-if="newAd.image" class="image-preview">
      <img :src="newAd.image" alt="Preview" class="preview-image"/>
    </div>
      <div class="custom-upload-container" @click="triggerFileInput">
        <q-icon name="add" size="2xl" />
        <input type="file" ref="fileInput" class="hidden-file-input" @change="handleFileChange" />
      </div>
    </div>
  </div>
</q-card-section>

        <q-card-actions align="right">
          <q-btn outlined  label="取消" color="negative" @click="cancelAdd"  />
          <q-btn outlined  label="儲存" color="positive" @click="addAd" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdsStore } from '../stores/adsStore'

const adsStore = useAdsStore()
const isEditing = ref(false)

const title = ref('')
const showAddDialog = ref(false)
const newAd = ref({
  title: '',
  status: '',
  link: '',
  image: null
})

const statusOptions = ['啟用', '停用']

const columns = [
  { name: 'image', label: '圖片', field: 'image', align: 'center', sortable: true },
  { name: 'title', label: '標題', field: 'title', align: 'center', sortable: true },
  { name: 'actions', label: '功能', field: 'id', align: 'center' }
]

function resetForm () {
  newAd.value = { title: '', status: '', link: '', image: null }
  isEditing.value = false
  showAddDialog.value = false
}

function addAd () {
  adsStore.addAd({ ...newAd.value })
  showAddDialog.value = false
  newAd.value = { title: '', status: '', link: '', image: null }
  isEditing.value = false
  resetForm()
}
const cancelAdd = () => {
  showAddDialog.value = false
  resetForm()
}

function filterAds () {
  adsStore.filterAds(title.value)
}

const fileInput = ref(null)

function triggerFileInput () {
  fileInput.value.click()
}

const editAd = (ad) => {
  newAd.value = { ...ad }
  showAddDialog.value = true
  isEditing.value = true
}

// 覆蓋
function handleFileChange (event) {
  const file = event.target.files[0]
  if (file) {
    // 圖片轉為 URL 存 newAd
    newAd.value.image = URL.createObjectURL(file)
  }
}
</script>

<style scoped lang="scss">

</style>
