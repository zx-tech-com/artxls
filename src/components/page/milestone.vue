<template>
    <div class="table" v-loading="$root.showLoadingIcon">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<!-- TODO 修改下图标-->
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 艺术家生涯</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增事件</el-button>
            </div>
            <el-table :data="data" border class="table">
                <el-table-column prop="index" label="序号" sortable  align="center" width="80"></el-table-column>
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="iname" label="艺术家" align="center" width="80">
                </el-table-column>
				<el-table-column prop="myear" label="创作时间" sortable align="center"  width="120"></el-table-column>
                <el-table-column prop="introduction" header-align="center" label="描述" ></el-table-column>

                <el-table-column label="操作"  align="center" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

		<!-- 编辑弹出框 -->
		<el-dialog title="修改生涯" :visible.sync="editVisible" width="40%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="艺术家">
				    <el-input   value="萧龙士" readonly></el-input>
				</el-form-item>
				<el-form-item label="创作时间">
					<el-input v-model="form.myear" ></el-input>
				</el-form-item>
				
			    <el-form-item label="作品介绍">
			        <el-input v-model="form.introduction" type="textarea" :rows="6"></el-input>
			    </el-form-item>
			</el-form>
		   
		    <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">提 交</el-button>
				</div>
		    </span>
		</el-dialog>



        <!-- 新增弹出框 -->
        <el-dialog title="新增生涯" :visible.sync="addVisible" width="40%">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="艺术家">
				    <el-input   value="萧龙士" readonly></el-input>
				</el-form-item>
				<el-form-item label="创作时间">
					<el-input v-model="form.myear" ></el-input>
				</el-form-item>
				
			    <el-form-item label="作品介绍">
			        <el-input v-model="form.introduction" type="textarea" :rows="6"></el-input>
			    </el-form-item>
			</el-form>
            <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="addSubmit">提 交</el-button>
				</div>
            </span>
        </el-dialog>

        <!-- TODO删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
				
				url : 'event/list?InfoId=1',
				editUrl : 'event/update',
				delUrl : 'event/delete',
				addUrl : 'event/add',
				events : [],
				fileName : 'img',
				fileList:[],
				limit : 1,
				withCredentials : true,
				
				addVisible:false,
				editVisible: false,
				delVisible: false,
				
                form: {
                    introduction: '',
                    myear: '',
                    creatTime: '',
					id : null,
					iname:null
                },		
				
				waitToDel:{}//等待被删除的对象

            }
        },
        created() {
			//初始化轮播图数据
            this.geList();
			//初始化修改轮播图的url地址
			this.editUrl = this.$urlConfig.baseUrl + this.editUrl;
			this.addUrl = this.$urlConfig.baseUrl + this.addUrl;
        },
        computed: {
            data() {
				var vue = this;
                return vue.events.map((event,index) => {
                   return {
					   index : index + 1,
					   id : event.id,
					   introduction : event.introduction,
					   myear : event.myear,
					   creatTime:event.createTime,
					   iname:'萧龙士'
				   };
                })
            },
			editData : function(){
				var vue = this;
				return {
					id : vue.form.id,
					introduction : vue.form.introduction,
					myear : vue.form.myear
				}
			},
			addData : function(){
				var vue = this;
				return {
					infoId:'1',
					introduction : vue.form.introduction,
					myear : vue.form.myear
				}
			}
        },
        methods: {
            geList() {
				var vue = this;
				vue.$jsonAxios.get(vue.url).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					vue.$util.getSuccessHandler(response,vue,"events");
				}).catch(function(err){
					vue.$util.axiosErrorHandler(err,vue);
				})
                
            },

			handleAdd(){
				var vue = this;
				//清空fileList
				vue.fileList = [];
				//清空form
				vue.form = {};
				vue.addVisible = true;
			},

            handleEdit(index, row) {
				var vue = this;
                vue.idx = index;
                const event = vue.data[index];
                vue.form = {
                    introduction: event.introduction,
					myear : event.myear,
					id : event.id
                }
				vue.fileList = [];
                vue.editVisible = true;
            },
			
            handleDelete(index, row) {
                this.waitToDel.idx = index;
				this.waitToDel.id = row.id;
                this.delVisible = true;
            },
				
				
			//新增请求
			addSubmit(){
				var vue = this;
				var data = vue.$qs.stringify(vue.addData);
				vue.$jsonAxios.post(vue.addUrl,data).then(function(response){
						var responseData = response.data;
						if(responseData.code == vue.$util.success_code)
							vue.$message.success("成功！");
						else
							vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
						//刷新列表
						vue.getRawBannerList();
						//隐藏编辑框
						vue.editVisible = false;
					}).catch(function(error){
						
					})
			},
					
            // 提交修改请求
            saveEdit() {
				//这里直接调用UI-Element的函数.不需要手动调用axios发送请求
				//附加的数据也会一并发送过去
				var vue = this;
				var data = vue.$qs.stringify(vue.editData);
				console.log("123");
				console.log(data);
					vue.$jsonAxios.post(vue.editUrl,data).then(function(response){
						var responseData = response.data;
						if(responseData.code == vue.$util.success_code)
							vue.$message.success("成功！");
						else
							vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
						//刷新列表
						vue.getRawBannerList();
						//隐藏编辑框
						vue.editVisible = false;
					}).catch(function(error){
						
					})
            },
            // 确定删除
            deleteRow(){
				var vue = this;
				
				//使用axios删除
				var url = vue.delUrl + "?id=" + vue.waitToDel.id;
				vue.$jsonAxios.get(url).then(function(response){
					vue.$util.signleDeleteSuccessHandler(response,vue,"events",vue.waitToDel.idx);
					vue.delVisible = false;
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error);
				})
            },
        
			editSuccess : function(response, file, fileList){
				var vue = this;
				if(vue.$util.checkIfResponseSuccess(response)){
					vue.$message.success(`成功!`);
					//刷新列表
					vue.getRawBannerList();
					//隐藏编辑框
					vue.editVisible = false;
					vue.addVisible = false;
				}else{
					vue.editFailure();
				}
				
			},
			
			editFailure: function(response, file, fileList){
				this.$message.error(`失败!`);
			},
			
			onExceed : function(){
				this.$message.error(`最多上传一张,请先删除左边的轮播图`);
			}
		}
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
	/* flex布局居中 */
	.footer-center{
		display: flex;
		justify-content: center;
	}
	
</style>
