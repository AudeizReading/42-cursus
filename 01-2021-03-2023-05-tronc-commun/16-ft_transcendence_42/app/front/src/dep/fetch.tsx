export function fetch_opt() {
  return {
    headers: { Authorization: localStorage['bearer'] ? 'Bearer ' + localStorage['bearer'] : '' }
  };
};
