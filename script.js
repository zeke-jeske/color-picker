$(function () {
  var $hue = $('#hue'),
      $pane = $('#pane'),
      $knob = $('#knob'),
      $colorFormats = $('.color-format'),
      color = new Color({red: 255, green: 0, blue: 0}),
      dragging = false;

  $hue.on('input', getColorFromSelectors);

  $colorFormats
    .blur(function() {
      updateColorIndicators();
      updateSelectorsFromColor();
    })
    .on('input', function() {
      var value = $(this).val(),
          out;

      if (color[$(this).attr('id')]($(this).val()) instanceof Color) {
        updateColorIndicators();
        updateSelectorsFromColor();
      };
    });

  $pane.mousedown(function (e) {
    e.preventDefault();
    dragging = true;
    updateKnobPosition(e.pageX, e.pageY);
  });

  $(document)
    .mousemove(function (e) {
      if (dragging) {
        e.preventDefault();
        updateKnobPosition(e.pageX, e.pageY);
      }
    })
    .mouseup(function (e) {
      if (dragging) {
        e.preventDefault();
        dragging = false;
        updateKnobPosition(e.pageX, e.pageY);
      }
    });

  function updateColorIndicators() {
    $('body').css('--hue', color.hsv().hue);
    $('body').css('--color', color.hex());

    // Update each of the color format input's values, excluding any that are focused at the time
    $colorFormats.not(':focus').each(function() {
      $(this).val(color[$(this).attr('id')]());
    });
  }

  function updateSelectorsFromColor() {
    var hsv = color.hsv(),
        hue = hsv.hue,
        saturation = hsv.saturation,
        value = hsv.value,
        paneWidth = $pane.width(),
        paneHeight = $pane.height(),
        left = saturation / 100 * paneWidth - 10,
        top = paneHeight - value / 100 * paneHeight - 10;

    // Update hue slider to show the new hue
    $hue.val(hue);

    // Update color pane to show the new saturation and value
    $knob.css({
      left: left + 'px',
      top: top + 'px'
    });
  }

  function updateKnobPosition(mouseX, mouseY) {
    var x = (mouseX - $pane.offset().left),
        y = (mouseY - $pane.offset().top);

    // Make sure the knob stays inside the color pane
    if (x < 0) x = 0;
    else if (x > $pane.width()) x = $pane.width();
    if (y < 0) y = 0;
    else if (y > $pane.height()) y = $pane.height();

    // Update the knob's position, subtracting 10px for the width of the knob itself
    $knob.css({left: x - 10 + 'px', top: y - 10 + 'px'});

    // Update the color from the new knob position
    getColorFromSelectors();
  }

  function getColorFromSelectors() {
    var hue = parseInt($hue.val()),
        saturation = ($knob.offset().left - $pane.offset().left + 10) / $pane.width() * 100,
        value = 100 - ($knob.offset().top - $pane.offset().top + 10) / $pane.height() * 100;

    color.hsv({hue: hue, saturation: saturation, value: value});
    updateColorIndicators();
  }
});
