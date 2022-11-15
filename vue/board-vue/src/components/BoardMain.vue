<template>
    <div class="container">
		<h4 class="text-center mt-3">🎅🎄게시판🎅🎄</h4>

		<div class="input-group mb-3  mt-3">
			<input type="text" class="form-control"  v-model="searchWord" @keydown.enter="boardList"
				placeholder="Search" />
			<button class="btn btn-success" type="button" @click="boardList">Search</button>
		</div>

		<table class="table table-hover">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">작성자</th>
					<th scope="col">제목</th>
					<th scope="col">작성일자</th>
					<th scope="col">조회수</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in list" :key="index" @click="test(row)" style="cursor:pointer">
					<td>{{row.boardId}}</td>
					<td>{{row.userName}}</td>
					<td>{{row.title}}</td>
					<!-- <td>{{ row.regDt.date | makeDateStr('.') }}</td> -->
					<td>{{ row.regDt.date | makeDateStr('.') }}</td>
					<td>{{row.readCount}}</td>
				</tr>
			</tbody>
		</table>

		<!-- PaginationUI Component 4개 props 필요 -->
		<pagination-u-i v-bind:listRowCount="listRowCount"
						v-bind:pageLinkCount="pageLinkCount"
						v-bind:currentPageIndex="currentPageIndex"
						v-bind:totalListItemCount="totalListItemCount"
						v-on:call-parent-move-page="movePage"
						></pagination-u-i>

		<button class="btn btn-success" type="button" @click="showInsertModal">글쓰기</button>
		<insert-modal v-on:call-parent-insert="closeAfterInsert"></insert-modal>
	</div>
</template>

<script>
import http from "@/common/axios.js" //axios객체
import util from "@/common/util.js"
import PaginationUI from "@/components/PaginationUI.vue"
import InsertModal from '@/components/modals/InsertModal.vue' //vue 컴포넌트
import {Modal} from "bootstrap"; //vue 컴포넌트에서 bootstrap modal 을 사용하기 위함.

export default {
	components: {
		PaginationUI,
		InsertModal,
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
			insertModal:null, //bootstrap Modal 객체를 할당(ui component를 전달)
        }
    },
    methods: {
		test(title) { //row
			alert(title);

		},
        async boardList() {
            let params = {
                limit: this.limit,
                offset: this.offset,
                searchWord: this.searchWord
            }

            try {
                // axios가 json으로 parameter를 보내는 방법 : 객체를 전달
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
                this.$alertify.error("서버에 문제가 생겼습니다.");
            }
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
		}
    },
	created () {
		this.boardList();
	},
	mounted() {
		//모달 객체를 생성해서 data의 변수에 할당
		this.insertModal = new Modal(document.querySelector("#insertModal"));

	},
	filters : {
		makeDateStr(date, type) {
			return util.makeDateStr(date.year, date.month, date.day, type); //import한 util을 이용해서 filter
		}
	}
}
</script>

<style>

</style>