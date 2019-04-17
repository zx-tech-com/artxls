<template>
    <div v-loading="$root.showLoadingIcon">
		<el-row>
		     <el-col >
		        <el-card shadow="hover">
		            <el-button type="primary" @click="showDialog">编辑</el-button>
					<el-button type="primary" >刷新</el-button>
		        </el-card>
		    </el-col>
		</el-row>
        <el-row>
            <el-col>
                <el-card shadow="hover">
                    <div v-html="info.introduction"></div>
                </el-card>
            </el-col>
        </el-row>
		
		<el-dialog title="修改个人介绍" :visible.sync="editVisible" width="70%">
			<el-form ref="editform" :model="info" label-width="80px" >
				<el-form-item label="姓名"  prop="iname" >
				    <el-input v-model="editInfo.iname"></el-input>
				</el-form-item>
				
				<el-form-item label="介绍" prop="introduction">
					<div class="container">
						<quill-editor ref="myTextEditor" v-model="editInfo.introduction" :options="editorOption"></quill-editor>
					</div>
				</el-form-item>
				
			</el-form>
		    <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="hideDialog">取 消</el-button>
					<el-button type="primary" @click="submit">提 交</el-button>
				</div>
		    </span>
		</el-dialog>
		
    </div>
</template>

<script>
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
	
	import { quillEditor } from 'vue-quill-editor';
	
    export default {
        name: 'info',
		
        data: function() {
            return {
				getUrl : 'info/get',
				updateUrl : 'info/update',
				info : {},
				editInfo : {},
				editVisible : false,
				editorOption: {
				    placeholder: '请输入个人介绍'
				}
            }
        },
		components: {
		    quillEditor
		},
        computed: {
        },
        created: function(){
			this.initInfo();
        },
        methods: {
			initInfo:function(){
				var app = this;
				app.$jsonAxios.get(app.getUrl).then(function(response){
					var data = response.data;
					if(app.$util.checkIfDataSuccess(data)){
						app.info = data.data;
					}else
						app.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(error){
					
				})
			},
			onEditorChange({ editor, html, text }) {
				console.log();
			    this.info.introduction = html;
			},
			showDialog : function(){
				var app = this;
				app.editInfo = {
					id : app.info.id,
					iname : app.info.iname,
					introduction:app.info.introduction
				};
				app.editVisible = true;
			},
			hideDialog : function(){
				this.editVisible = false;
			},
			submit : function(){
				var app = this;
				
				app.$jsonAxios.post(app.updateUrl,app.$qs.stringify(app.editInfo)).then(function(response){
					var data = response.data;
					if(app.$util.checkIfDataSuccess(data)){
						//刷新列表
						app.initInfo();
						app.$message.success("修改成功！");
					}
						
					else
						app.$message.error("错误码：" + responseData.code + " " + responseData.message);
					//隐藏编辑框
					app.editVisible = false;
				}).catch(function(error){
					
				})
			}
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
