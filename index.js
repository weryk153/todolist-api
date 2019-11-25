$.ajax({
  type: 'GET',
  url: 'http://localhost:3000/todos/',
  success: function(resp) {
    console.log(resp);
  }
});
