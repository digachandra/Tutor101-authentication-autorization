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
          var html = `<li><div class="row"><div class="col-sm-12"><div class="input-group"><input type="text" class="form-control" disabled="disabled" value="${result[idx].name}"><span class="input-group-btn"><button class="btn btn-warning" type="button" onClick="initUpdate(this, '${result[idx]._id}')">Edit</button><button class="btn btn-danger" type="button" onClick="initDelete('${result[idx]._id}')">Delete</button></span></div></div></div></li>`
          list.prepend(html)
        }
      }
    }
  })
}

function initUpdate(pointer, id){
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

function initDelete(id){
  $.ajax({
    url: `${urlMaster}/${id}`,
    method: 'DELETE',
    success: function(result){
      if(!_.isEmpty(result)) initList()
    }
  })
}

$(function(){
  initList()
  initInsert()
})
