<template>
    <div class="container">
		<h4 class="text-center mt-3">ππ<strong>κ²μν</strong>ππ</h4>

		<div class="input-group mb-3  mt-3">
			<input type="text" class="form-control"  v-model="searchWord" @keydown.enter="boardList"
				placeholder="Search" />
			<button class="btn btn-success" type="button" @click="boardList">Search</button>
		</div>

		<table class="table table-hover">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">μμ±μ</th>
					<th scope="col">μ λͺ©</th>
					<th scope="col">μμ±μΌμ</th>
					<th scope="col">μ‘°νμ</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in list" :key="index" @click="boardDetail(row.boardId)" style="cursor:pointer">
					<td>{{row.boardId}}</td>
					<td>{{row.userName}}</td>
					<td>{{row.title}}</td>
					<!-- <td>{{ row.regDt.date | makeDateStr('.') }}</td> -->
					<td>{{ row.regDt.date | makeDateStr('.') }}</td>
					<td>{{row.readCount}}</td>
				</tr>
			</tbody>
		</table>

		<!-- PaginationUI Component 4κ° props νμ -->
		<pagination-u-i v-bind:listRowCount="listRowCount"
						v-bind:pageLinkCount="pageLinkCount"
						v-bind:currentPageIndex="currentPageIndex"
						v-bind:totalListItemCount="totalListItemCount"
						v-on:call-parent-move-page="movePage"
						></pagination-u-i>

		<button class="btn btn-success" type="button" @click="showInsertModal">κΈμ°κΈ°</button>
		<insert-modal v-on:call-parent-insert="closeAfterInsert"></insert-modal>
		<detail-modal v-bind:board="board"
			v-on:call-parent-change-to-update="changeToUpdate"
			v-on:call-parent-change-to-delete="changeToDelete"></detail-modal>
		<update-modal v-bind:board="board" v-on:call-parent-update="closeAfterUpdate"></update-modal>
	</div>
</template>

<script>
import http from "@/common/axios.js" //axiosκ°μ²΄
import util from "@/common/util.js"
import PaginationUI from "@/components/PaginationUI.vue"
import InsertModal from '@/components/modals/InsertModal.vue' //vue μ»΄ν¬λνΈ
import DetailModal from '@/components/modals/DetailModal.vue' //vue μ»΄ν¬λνΈ
import UpdateModal from '@/components/modals/UpdateModal.vue'
import {Modal} from "bootstrap"; //vue μ»΄ν¬λνΈμμ bootstrap modal μ μ¬μ©νκΈ° μν¨.

export default {
	components: {
		PaginationUI,
		InsertModal,
		DetailModal,
		UpdateModal
	},
    data() {
        return {
            limit: 10,
            offset: 0,
            searchWord: '',
			list: [],
			//row

			totalListItemCount:0,
			listRowCount:10,
			pageLinkCount:10,
			currentPageIndex:1,

			// modal
			insertModal:null, //bootstrap Modal κ°μ²΄λ₯Ό ν λΉ(ui componentλ₯Ό μ λ¬)
			detailModal:null,
			updateModal:null,

			//detail
			board: {
				boardId: 0,
				title: "",
				content: "",
				userName:"",
				regDate: "", //λ°±μλλ‘λΆν° λ°λ dtoλ regDtλ§ λ°λλ° μ΄λ₯Ό λΆν΄ν΄μ regDate, regTimeμΌλ‘ λλλ €λ μκ°
				regTime:"",
				readCount:0,
				fileList: [],
				sameUser: false,
			}
        }
    },
    methods: {
		async boardDetail(boardId) { //row
			// λ°±μλ μμ²­ - κ²°κ³Ό
			// DetailModal <- κ²°κ³Ό : dataν­λͺ©μ board κ°μ²΄λ₯Ό μΆκ°νκ³  propsλ‘ DetailModalμ λκ²¨μ€λ€. λ°±μλ μμ²­ κ²°κ³Όλ₯Ό dataμ boardλ₯Ό λ³κ²½νλ©΄ μλ λ°μ
			// DetailModal show 
			try {
				let response = await http.get(`/boards/${boardId}`);
				let {data} = response;
				console.log(data);
				if(data.result == "login") {
					this.$router.push("/login");
				} else {
					console.log(data.dto);
					// λ μ§, μκ° λΆλ¦¬
					let {regDt} = data.dto;
					let boardNew = {
						regDate: util.makeDateStr(regDt.date.year, regDt.date.month, regDt.date.day,"-"),
						regTime: util.makeTimeStr(regDt.time.hour, regDt.time.minute, regDt.time.second,":"),
						...data.dto //λλ¨Έμ§λ μ¬κΈ°μ λ°μ - 3dot operator rest
					}
					
					//νμ¬ board κ΅μ²΄
					this.board = boardNew;

					this.detailModal.show();
				}
			}catch(error) {
				console.error(error);
                this.$alertify.error("μλ²μ λ¬Έμ κ° μκ²Όμ΅λλ€.");
			}
		},
        async boardList() {
            let params = {
                limit: this.limit,
                offset: this.offset,
                searchWord: this.searchWord
            }

            try {
                // axiosκ° jsonμΌλ‘ parameterλ₯Ό λ³΄λ΄λ λ°©λ² : κ°μ²΄λ₯Ό μ λ¬
                let response = await http.get("/boards", { params })
                let {data} = response;
				
				// interceptor session check fail
				if(data.result == "login") {
					this.$router.push("/login");
				} else {
					this.list = data.list;
					this.totalListItemCount = data.count;
				}

            } catch(error) {
                console.error(error);
                this.$alertify.error("μλ²μ λ¬Έμ κ° μκ²Όμ΅λλ€.");
            }
        },
		changeToUpdate() {
			this.detailModal.hide();
			this.updateModal.show();
		},
		movePage(pageIndex) {
			this.offset = (pageIndex - 1) * this.listRowCount;
			this.currentPageIndex = pageIndex;
			this.boardList();
		},
		showInsertModal() {
			this.insertModal.show();
		},
		closeAfterInsert() {
			this.insertModal.hide();
			this.boardList();
		},
		closeAfterUpdate() {
			this.updateModal.hide();
			this.boardList();
		},
		changeToDelete() {
			this.detailModal.hide();
			var $this = this;
			this.$alertify.confirm("μ΄ κΈμ μ­μ νμκ² μ΅λκΉ?", 
				function() {
					//this.boardDelete(); //μ΄λ κ² μ°λ thisλ μ»΄ν¬λνΈλ₯Ό κ°λ¦¬ν€λκ² μλ.
					$this.boardDelete();
				}, 
				function() {
					console.log("cancel");
				}
			)
		},
		async boardDelete() {
			try {
				let response = await http.delete('/boards/'+this.board.boardId);
				let {data} = response;
				if (data.result == "login") {
					this.$router.push("/login");
				} else {
					this.$alertify.success("κΈμ΄ μ­μ λμμ΅λλ€.");
					this.boardList();
				}
			} catch(error) {
				console.error(error);
			}
		}
    },
	created () {
		this.boardList();
	},
	mounted() {
		//λͺ¨λ¬ κ°μ²΄λ₯Ό μμ±ν΄μ dataμ λ³μμ ν λΉ
		this.insertModal = new Modal(document.querySelector("#insertModal"));
		this.detailModal = new Modal(document.querySelector("#detailModal"));
		this.updateModal = new Modal(document.querySelector("#updateModal"));
},
	filters : {
		makeDateStr(date, type) {
			return util.makeDateStr(date.year, date.month, date.day, type); //importν utilμ μ΄μ©ν΄μ filter
		}
	},
	watch : {
		board() {
			this.boardList();
		}
	}
}
</script>

<style>

</style>