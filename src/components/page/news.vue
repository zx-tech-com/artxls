<template>
    <div class="table" v-loading="$root.showLoadingIcon">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<!-- TODO 修改下图标-->
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 资讯列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				<el-select v-model="queryInfo.ntype"  placeholder="动态/新闻/" class="handle-select mr10">
				    <el-option v-for="(news, index) in newsTypes" :key="index" :label="news" :value="index"></el-option>
				</el-select>
				<el-button type="primary" icon="search" @click="getRawNewsList">搜索</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleAdd">新增资讯</el-button>
            </div>
            <el-table :data="data" border class="table">
                <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
                <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
				<el-table-column prop="title" label="标题" align="center"></el-table-column>
				<!-- <el-table-column prop="summary" label="摘要" align="center"></el-table-column> -->
                <el-table-column prop="author" label="作者" width="100px" align="center"></el-table-column>
                <el-table-column prop="origin" label="来源" width="100px"  align="center"></el-table-column>
				<el-table-column prop="ntype" label="类型" width="80px"  align="center"></el-table-column>
				<el-table-column prop="publishTime" label="发布时间" align="center"></el-table-column>
				<!-- <el-table-column prop="createTime" label="录入时间" align="center"></el-table-column> -->
				<el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
                </el-table-column>
            </el-table>
			<div class="pagination">
			    <el-pagination background @current-change="pageChange" :page-size="pageInfo.pageSize"
					layout="prev, pager, next" :total="pageInfo.totalCount"></el-pagination>
			</div>
        </div>



		<!-- 编辑弹出框 -->
		<el-dialog title="修改资讯" :visible.sync="editVisible" width="70%">
			<el-form ref="editform" :inline="true" :model="form" label-width="80px" >
				
			    <el-form-item label="标题"  prop="title">
			        <el-input v-model="form.title"></el-input>
			    </el-form-item>
				
			    <el-form-item label="摘要" prop="summary">
			        <el-input width="500px" :rows="4" :cols="40" type="textarea" v-model="form.summary" placeholder="请输入摘要"></el-input>
			    </el-form-item>
				
				<el-form-item label="作者"  prop="author">
				    <el-input v-model="form.author" placeholder=""></el-input>
				</el-form-item>
				
				<el-form-item label="来源"   prop="origin">
				    <el-input v-model="form.origin" placeholder="请输入摘要"></el-input>
				</el-form-item>
				
				<el-form-item label="类型"  prop="ntype" >
				    <el-select v-model="form.ntype" placeholder="选择类型" class="handle-select mr10">
				        <el-option v-for="(news, index) in newsTypes" :key="index" :label="news" :value="index"></el-option>
				    </el-select>
				</el-form-item>

				<el-form-item label="发布时间"  prop="publishTime">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" v-model="form.publishTime" style="width: 100%;"></el-date-picker>
				</el-form-item>
				
				<el-form-item label="正文" prop="introduction">
					<div class="container">
						<quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
					</div>
				</el-form-item>
				
			</el-form>
		    <span slot="footer" class="dialog-footer">
				<div class="footer-center">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="editSubmit">提 交</el-button>
				</div>
		    </span>
		</el-dialog>



        <!-- 新增弹窗 -->
        <el-dialog title="新增资讯" :visible.sync="addVisible" width="70%">
        	<el-form ref="addform" :inline="true" :model="form" label-width="80px" >
        		
        	    <el-form-item label="标题"  prop="title">
        	        <el-input v-model="form.title"></el-input>
        	    </el-form-item>
        		
        	    <el-form-item label="摘要" prop="summary">
        	        <el-input width="500px" :rows="4" :cols="40" type="textarea" v-model="form.summary" placeholder="请输入摘要"></el-input>
        	    </el-form-item>
        		
        		<el-form-item label="作者"  prop="author">
        		    <el-input v-model="form.author" placeholder=""></el-input>
        		</el-form-item>
        		
        		<el-form-item label="来源"   prop="origin">
        		    <el-input v-model="form.origin" placeholder="请输入摘要"></el-input>
        		</el-form-item>
        		
        		<el-form-item label="类型"  prop="ntype" >
        		    <el-select v-model="form.ntype" placeholder="选择类型" class="handle-select mr10">
        		        <el-option v-for="(news, index) in newsTypes" :key="index" :label="news" :value="index"></el-option>
        		    </el-select>
        		</el-form-item>
        
        		<el-form-item label="发布时间"  prop="publishTime">
        			<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" v-model="form.publishTime" style="width: 100%;"></el-date-picker>
        		</el-form-item>
        		
        		<el-form-item label="正文" prop="introduction">
        			<div class="container">
        				<quill-editor ref="myTextEditor2" v-model="form.content" :options="editorOption"></quill-editor>
        			</div>
        		</el-form-item>
        		
        	</el-form>
            <span slot="footer" class="dialog-footer">
        		<div class="footer-center">
        			<el-button @click="cancelAdd">取 消</el-button>
        			<el-button type="primary" @click="addSubmit">提 交</el-button>
        		</div>
            </span>
        </el-dialog>

        <!-- TODO删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">确定要删除该资讯吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
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
        name: 'basetable',
        data() {
            return {
				
				listUrl : 'news/listback',
				addUrl : 'news/add',
				editUrl : 'news/update',
				delUrl : 'news/delete',
				
				newsTypes : ['评论','动态','观点','视频'],
				
				onlinTypes : ['上架','下架'],
				
				newsList : [],

				
				addVisible:false,
				editVisible: false,
				delVisible: false,
				
				queryInfo:{//查询条件
				},
				
				pageInfo:{
					"pageNumber": 1,		//形如这种格式
					//"pageSize": 6,
					//"start": 0,
					//"totalCount": 22,
					"totalPage": 1
				},
				
				validateOnRuleChange : false,
				
                form: {//新增或者修改都需要用到
                },		
				
				editorOption: {
				    placeholder: '在这里插入'
				},
				
				waitToDelete:{
					id : -1,
				}

            }
        },
        created: function(){
			//初始化轮播图数据
            this.getRawNewsList();
        },
		components: {
		    quillEditor
		},
        computed: {
			
            data: function(){
				var vue = this;
                return vue.newsList.map((news,index) => {
                   return {
					   index : index + 1,
					   id : news.id,
					   infoId : news.infoId,
					   createTime : news.createTime,
					   publishTime : news.publishTime,
					   author : news.author,
					   summary : news.summary,
					   title : news.title,
					   origin : news.origin,
					   ntype : vue.newsTypes[news.ntype],
					   content : news.content,
					   
				   };
                })
            },
			editData : function(){
				var vue = this;
				return {
					id : vue.form.id,
					infoId : vue.form.infoId,
					createTime : vue.form.createTime,
					publishTime : vue.form.publishTime,
					author : vue.form.author,
					summary : vue.form.summary,
					title : vue.form.title,
					origin : vue.form.origin,
					ntype : vue.form.ntype,
					content : vue.form.content,
				}
			},
			addData : function(){
				var vue = this;
				return {
					infoId : vue.form.infoId,
					publishTime : vue.form.publishTime,
					author : vue.form.author,
					summary : vue.form.summary,
					title : vue.form.title,
					origin : vue.form.origin,
					ntype : vue.form.ntype,
					content : vue.form.content,
				}
			}
        },
        methods: {
            getRawNewsList() {
				var vue = this;
				var finalUrl = vue.assembleQueryUrl();
				vue.$jsonAxios.get(finalUrl).then(function(response){
					//这里只能说明返回的状态码是以2开头的.
					var data = response.data;
					if(data.code == vue.$util.success_code){//成功返回列表
						vue.newsList = data.data.newsList;
						var page = data.data.pageInfo;
						vue.pageInfo = {
							pageNumber : page.pageNumber,
							pageSize : page.pageSize,
							totalCount : page.totalCount
						};
					}else
						vue.$message.error("错误码：" + data.code + " " + data.message);
				}).catch(function(err){
					//console.log(err);
					vue.$util.axiosErrorHandler(err,vue);
				})
            },

			assembleQueryUrl : function(){
				var pageInfo = this.pageInfo;
				pageInfo.pageNum = this.pageInfo.pageNumber;
				var query = this.queryInfo;
				var params = {};
				this.$util.assembleNewParamsWithNoUndefinedNullProperty(params,pageInfo);
				this.$util.assembleNewParamsWithNoUndefinedNullProperty(params,query);
				return this.listUrl + "?" + this.$qs.stringify(params);
			},

			handleAdd(){
				var vue = this;
				//重置form
				vue.form = {
					infoId : 1,
				};
				vue.addVisible = true;
				vue.$nextTick(function(){
					vue.$refs.addform.clearValidate();
				})
			},

            handleEdit(index, row) {
				var vue = this;
                vue.idx = index;
                const news = vue.data[index];
                vue.form = {
					id : news.id,
					infoId : news.infoId,
					createTime : news.createTime,
					publishTime : news.publishTime,
					author : news.author,
					summary : news.summary,
					title : news.title,
					origin : news.origin,
					ntype : vue.newsTypes.indexOf(news.ntype),
					content : news.content,
                }
				vue.fileList = [];
                vue.editVisible = true;
				vue.$nextTick(function(){//注意需要在visible为true之后调用 emmmmm
					vue.$refs.editform.clearValidate();
				})
            },
			
			handleDelete(index,row){
				var vue = this;
				vue.delVisible = true;
				vue.waitToDelete.id = row.id;
				vue.waitToDelete.idx = index;
			},
				
			//新增请求
			addSubmit(){
				var vue = this;
				console.log(vue.addData);
				vue.$jsonAxios.post(vue.addUrl,vue.$qs.stringify(vue.addData)).then(function(response){
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData))
						vue.$message.success("新增成功！");
					else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
					//刷新列表
					vue.getRawNewsList();
					//隐藏编辑框
					vue.addVisible = false;
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error,vue)
				})
			},
					
            // 提交修改请求
            editSubmit() {
				var vue = this;
				console.log(vue.editData);
				vue.$jsonAxios.post(vue.editUrl,vue.$qs.stringify(vue.editData)).then(function(response){
					var responseData = response.data;
					if(vue.$util.checkIfDataSuccess(responseData))
						vue.$message.success("修改成功！");
					else
						vue.$message.error("错误码：" + responseData.code + " " + responseData.message);
					//刷新列表
					vue.getRawNewsList();
					//隐藏编辑框
					vue.editVisible = false;
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error,vue)
				})
            },
			
            // 确定删除
            deleteRow(){
				var vue = this;
				//使用axios删除
				vue.$jsonAxios.post(vue.delUrl,vue.$qs.stringify(vue.waitToDelete)).then(function(response){
					var data = response.data;
					if(data.code == vue.$util.success_code){
						vue.newsList.splice(vue.waitToDelete.idx, 1);
						vue.$message.success("删除成功");
					}
					else{
						vue.$message.error("错误码：" + data.code + " " + data.message);
					}
					vue.delVisible = false;
				}).catch(function(error){
					vue.$util.axiosErrorHandler(error);
				})
            },
			
			cancelAdd : function(){
				this.addVisible = false;
			},
			cancelEdit:function(){
				this.editVisible = false;
			},
		
			pageChange : function(val){
				this.pageInfo.pageNumber = val;
				this.getRawNewsList();
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
