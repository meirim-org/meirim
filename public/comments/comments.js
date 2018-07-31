const init_comments = ({
    planId,
    el
  }) =>
  Promise.all([
    API.get_promise('comment/' + planId),
    loadTemplate('/comments/template.mustache'),
  ])
  .then(([comments, template]) => {
    el.html(Mustache.render(template, comments));

    $('.add-comment textarea').focus(() => {
      $(".add-comment textarea").attr("rows", 4);
      $(".add-comment .form-group").removeAttr("hidden");
    });

    $('.add-comment').submit((e) => {
      const content = $(e.target).find("[name='content']").val();
      const alias = $(e.target).find("[name='alias']").val();
      const parent_id = $(e.target).find("[name='parent_id']").val();
      const plan_id = planId;
      
      e.preventDefault();
      API.post('comment/' + planId, {content,alias, parent_id,plan_id})
      .done(() => init_comments({
        planId,
        el
      }));
    })
  })
  .catch(error => console.error(error));