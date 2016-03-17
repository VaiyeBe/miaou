// functions related to user profile displaying on hover

miaou(function(prof, gui, locals, skin){

	var	showTimer,
		shown = false;

	prof.checkOverProfile = function(e){
		if (shown && !$('.profile,.profiled').contains(e)) prof.hide();
	}

	prof.shownow = function(){
		if ($('.dialog').length) return;
		var $user = $(this).closest('.user');
		if (!$user.length) $user = $(this).closest('.user-messages').find('.user');
		var	user = $user.dat('user') || $user.closest('.notification,.user-messages,.user-line').dat('user'),
			uo = $user.offset(),
			uh = $user.outerHeight(), uw = $user.width(),
			wh = $(window).height(),
			mintop = 0, maxbot = wh,
			$ms = gui.$messageScroller,
			$p = $('<div>').addClass('profile').text('loading profile...'),
			css = {};
		if ($ms.length) {
			mintop = $ms.offset().top;
			maxbot = wh-($ms.offset().top+$ms.height());
		}
		if (uo.top>wh/2) {
			css.bottom = Math.max(wh-uo.top-uh, maxbot);
		} else {
			css.top = Math.max(uo.top, mintop);
		}
		css.left = uo.left + uw;
		window.fetch('publicProfile?user='+user.id+'&room='+locals.room.id)
		.then(function(response){
			return response.text();
		})
		.then(function(html){
			$p.html(html);
			$p.find('.avatar').css('color', skin.stringToColour(user.name));
			if ($p.offset().top+$p.height()>wh) {
				$p.css('bottom', '0').css('top', 'auto');
			}
		});
		$p.css(css).appendTo('body');
		$user.addClass('profiled');
		$(window).on('mousemove', prof.checkOverProfile);
		shown = true;
	};

	// used in chat.jade, chat.mob.jade and auths.jade
	prof.show = function(){
		prof.hide();
		showTimer = setTimeout(prof.shownow.bind(this), miaou.chat.DELAY_BEFORE_PROFILE_POPUP);
	};

	prof.hide = function(){
		clearTimeout(showTimer);
		$('.profile').remove();
		$('.profiled').removeClass('profiled');
		$(window).off('mousemove', prof.checkOverProfile);
		shown = false;
	};

	prof.displayed = function(){
		return !!$('.profile').length;
	}

	prof.toggle = function(){
		prof[prof.displayed() ? 'hide' : 'show'].call(this);
	};
});
