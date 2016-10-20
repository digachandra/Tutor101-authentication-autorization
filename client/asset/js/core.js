var storageName = 'tutor101Secret'

function initPage(){
  $('#content').removeClass('hidden').css({
    "opacity":0
  }).animate({
    "opacity":1
  }, 200)
}

function actionOut(){
  localStorage.removeItem(storageName)
  window.location.href = 'signin.html'
}

function actionUpdate(pointer, id){
  var urlMaster = 'http://localhost:9000/fruits'

  pointer = $(pointer)
  var list = pointer.closest('li').find('input[type="text"]')

  if(list.hasClass('edit')){
    list.attr('disabled', 'disabled').removeClass('edit')
    pointer.removeClass('btn-success').addClass('btn-warning').text('Edit')
    var valueName = list.val().trim()
    if(!_.isEmpty(valueName)){
      $.ajax({
        url: `${urlMaster}/${id}`,
        data: {
          'name': valueName
        },
        method: 'PUT',
        success: function(result){
          if(!_.isEmpty(result)){
            initList()
          }
        }
      })
    }
  } else {
    var tempValue = list.val()
    list.removeAttr('disabled').addClass('edit').focus().val(tempValue)
    pointer.removeClass('btn-warning').addClass('btn-success').text('Save')
  }
}

function actionDelete(id){
  var urlMaster = 'http://localhost:9000/fruits'

  $.ajax({
    url: `${urlMaster}/${id}`,
    method: 'DELETE',
    success: function(result){
      if(!_.isEmpty(result)) initList()
    }
  })
}

function initPageDashboard(){
  var urlMaster = 'http://localhost:9000/fruits'

  function initInsert(){
    var form = $('#content-form')
    var name = $('#txt-name')

    form.unbind().on('submit', function(event){
      event.preventDefault()
      var valueName = name.val().trim()
      if(!_.isEmpty(valueName)){
        name.attr('disabled', 'disabled')
        $.post({
          url: urlMaster,
          data: {
            'name': valueName
          },
          success: function(result){
            if(!_.isEmpty(result)){
              initList()
              name.removeAttr('disabled').val('')
            }
          }
        })
      }
    })
  }

  function initList(){
    var list = $('#content-list')
    list.removeClass('hidden')
    $.get({
      url: urlMaster,
      success: function(result){
        list.empty()
        if(_.isEmpty(result)){
          var html = '<li><div class="alert alert-theme" role="alert">Record not found</div></li>'
          list.append(html)
        } else {
          for(var idx = 0; idx < result.length; idx++){
            var html = `<li><div class="row"><div class="col-sm-12"><div class="input-group"><input type="text" class="form-control" disabled="disabled" value="${result[idx].name}"><span class="input-group-btn"><button class="btn btn-warning" type="button" onClick="actionUpdate(this, '${result[idx]._id}')">Edit</button><button class="btn btn-danger" type="button" onClick="actionDelete('${result[idx]._id}')">Delete</button></span></div></div></div></li>`
            list.prepend(html)
          }
        }
      }
    })
  }

  initList()
  initInsert()
}

function initPageSignin(){
  var urlMaster = 'http://localhost:9000/users/authenticate'

  function initInsert(){
    var form = $('#content-form')
    var username = $('#txt-username')
    var password = $('#txt-password')

    form.unbind().on('submit', function(event){
      event.preventDefault()
      var valueName = username.val().trim()
      var valuePassword = password.val().trim()
      if(!_.isEmpty(valueName) && !_.isEmpty(valuePassword)){
        username.attr('disabled', 'disabled')
        password.attr('disabled', 'disabled')
        $.post({
          url: urlMaster,
          data: {
            'username': valueName,
            'password': valuePassword
          },
          success: function(result){
            if(!_.isEmpty(result)){
              localStorage.setItem(storageName, result.token)
              window.location.href = 'dashboard.html'
            }
          }
        })
      }
    })
  }

  initInsert()
}

function initPageSignup(){
  var urlMaster = 'http://localhost:9000/users'

  function initInsert(){
    var form = $('#content-form')
    var username = $('#txt-username')
    var password = $('#txt-password')

    form.unbind().on('submit', function(event){
      event.preventDefault()
      var valueName = username.val().trim()
      var valuePassword = password.val().trim()
      if(!_.isEmpty(valueName) && !_.isEmpty(valuePassword)){
        username.attr('disabled', 'disabled')
        password.attr('disabled', 'disabled')
        $.post({
          url: urlMaster,
          data: {
            'username': valueName,
            'password': valuePassword
          },
          success: function(result){
            if(!_.isEmpty(result)){
              window.location.href = 'signin.html'
            }
          }
        })
      }
    })
  }

  initInsert()
}

function verify(callback, condition, redirect = false){
  $.post({
    url: 'http://localhost:9000/verify',
    data: {
      'token': localStorage.getItem(storageName)
    },
    complete: function(xhr, textStatus) {
      if(xhr.status == 403 && !condition && redirect) window.location.href = redirect
      else if(xhr.status == 200 && condition && redirect) window.location.href = redirect
      else {
        initPage()
        callback
      }
    }
  })
}

$(function(){
  if(!_.isEmpty($("#page-dashboard"))){
    verify(initPageDashboard(), false, 'signin.html')
  } else if(!_.isEmpty($("#page-signin"))){
    verify(initPageSignin(), true, 'dashboard.html')
  } else if(!_.isEmpty($("#page-signup"))){
    verify(initPageSignup(), true, 'dashboard.html')
  }
})
