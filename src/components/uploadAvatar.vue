<template>
  <el-row>
    <el-upload
      ref="upload"
      action="#"
      accept=".jpg,.jpeg,.gif,.png"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="list"
      :on-change="handleChange"
      :limit="1"
      :disabled="disabled"
    >
      <!-- 图片 -->
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }" class="avatar-item">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog
      custom-class="loupe-dialog"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    fileList: Array
  },
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  computed: {
    list: {
      get () {
        return this.fileList
      },
      set (val) {
        this.$emit('update:fileList', val)
      }
    }
  },
  watch: {
    list (newValue, oldValue) {
      console.log(newValue)
      this.$emit('get-file-list', newValue)
    }
  },
  methods: {
    handleChange (file, files) {
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return this.$refs.upload.clearFiles()
      }
      this.list.push(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file) {
      this.$emit('on-remove')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-list {
  .el-upload-list__item {
    display : block;
    margin : 0;
    position : absolute;
    top : 0;
    left : 50%;
    height : 100%;
    border-radius : 50%;
    border : 0 none;
    transform : translateX(-50%);
    .avatar-item {
      position : absolute;
      top : 50%;
      left : 50%;
      width : 100%;
      transform : translate(-50%, -50%);
    }
  }
}
::v-deep .el-upload {
  border-radius : 50%;
}

</style>
