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
				<tr v-for="(row, index) in list" :key="index" @click="test(row.title)" style="cursor:pointer">
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

		<button class="btn btn-success" type="button">글쓰기</button>
	</div>
</template>

<script>
import http from "@/common/axios.js" //axios객체
import util from "@/common/util.js"
import PaginationUI from "@/components/PaginationUI.vue"

export default {
	components: {
		PaginationUI
	},
    data() {
        return {
            limit: 10,
            offset: 0,
            searchWord: '',
			list: [],

			totalListItemCount:0,
			listRowCount:10,
			pageLinkCount:10,
			currentPageIndex:1
        }
    },
    methods: {
		test(title) {
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
		}
    },
	created () {
		this.boardList();
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