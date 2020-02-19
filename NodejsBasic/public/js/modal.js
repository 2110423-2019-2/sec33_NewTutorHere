function Modal_show(chead, ctext) {
    $("#my-modal").css("display", "flex");
    $("#my-modal-head").html(chead);
    $("#my-modal-content").html(ctext);
    ModalAnimation();
}

function Modal_agree(chead, ctext, myfn) {
    Modal_show(chead, ctext);
    $("#my-modal-button-one").css("display", "none");
    $("#my-modal-button-two").css("display", "flex");

    /* click "no" */
    $("#my-modal-button-no").click(function() {
        ModalAnimationReversed();
    })

    /* click "yes" */
    $("#my-modal-button-yes").click(function() {
        myfn();
    })
}

function Modal_alert(chead, ctext) {
    Modal_show(chead, ctext);
    $("#my-modal-button-one").css("display", "flex");
    $("#my-modal-button-two").css("display", "none");

    /* click "Ok" */
    $("#my-modal-button-ok").click(function() {
        ModalAnimationReversed();
    })
}

function ModalAnimationReversed() {
    ModalAnimation(true);
}

function ModalAnimation(reversed = false) {
    const modal = document.getElementById('my-modal');
    const modal_body = document.getElementById('my-modal-body');
    const tl = new TimelineLite({ easeIn: Power3.easeOut });
    tl.fromTo(modal, 0.20, { opacity: 0 }, { opacity: 1 }, 0)
    tl.fromTo(modal_body, 0.20, {
        scale: 0,
        opacity: 0
    }, {
        scale: 1,
        opacity: 1
    }, 0);

    if (reversed) {
        tl.reverse(0.3);
        setTimeout(function() {
            $("#my-modal").css("display", "none");
        }, 500);
    }
}

window.onclick = function(event) {
    if (event.target == $("#my-modal")[0]) {
        ModalAnimationReversed()
    }
}