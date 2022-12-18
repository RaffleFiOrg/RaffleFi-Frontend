export const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,

    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                rows: 1,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                rows: 1,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 666,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 1,
                infinite: true,
                dots: true,
            },
        }

    ],
};