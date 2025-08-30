use actix_web::{HttpResponse, Error};
use minijinja::context;

pub async fn reference() -> Result<HttpResponse, Error> {
    crate::templates::render_template(
        "reference",
        context! {
            title => "Reference page",
        },
    )
}