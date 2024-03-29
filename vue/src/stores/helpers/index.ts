import { Ref } from "vue";
import {
  TablePaginateArgs,
  PaginationArgs,
  PaginationState,
} from "src/interfaces";

interface Variables extends PaginationArgs {
  where?: unknown;
  orderBy?: unknown;
}

export function tablePaginate(
  state: PaginationState,
  paginate: TablePaginateArgs,
  variables: Ref<Variables>
) {
  const goingForward = paginate.page > state.pagination.page;
  const goingBackward = paginate.page < state.pagination.page;
  if (goingForward && state.pageInfo.hasNextPage) {
    variables.value = {
      first: paginate.rowsPerPage,
      after: state.pageInfo.endCursor,
      where: variables.value.where,
      orderBy: variables.value.orderBy,
    };
    state.pagination = { ...state.pagination, ...paginate };
  } else if (goingBackward && state.pageInfo.hasPreviousPage) {
    variables.value = {
      last: paginate.rowsPerPage,
      before: state.pageInfo.startCursor,
      where: variables.value.where,
      orderBy: variables.value.orderBy,
    };
    state.pagination = { ...state.pagination, ...paginate };
  } else if (
    !!paginate.rowsPerPage &&
    paginate.rowsPerPage !== state.pagination.rowsPerPage
  ) {
    if (variables.value.first) {
      variables.value.first = paginate.rowsPerPage;
    } else {
      variables.value.last = paginate.rowsPerPage;
    }
    state.pagination = { ...state.pagination, ...paginate };
  }
}
