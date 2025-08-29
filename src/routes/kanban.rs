use actix_web::{HttpResponse, Error};
use minijinja::context;

pub async fn kanban() -> Result<HttpResponse, Error> {
    crate::templates::render_template(
        "kanban",
        context! {
            title => "Kanban Test Page",
        },
    )
}