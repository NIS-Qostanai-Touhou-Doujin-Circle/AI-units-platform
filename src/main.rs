use actix_files as fs;
use actix_web::{App, Error, HttpResponse, HttpServer, web};
use minijinja::context;
use serde::Serialize;
mod templates; // Импортируем наш модуль

// Добавляем универсальную функцию для рендеринга любого шаблона
fn render_template<T: Serialize>(template_name: &str, ctx: T) -> Result<HttpResponse, Error> {
    let env = templates::TEMPLATES
        .acquire_env()
        .map_err(|e| actix_web::error::ErrorInternalServerError(e.to_string()))?;

    let tmpl = env
        .get_template(template_name)
        .map_err(|e| actix_web::error::ErrorInternalServerError(e.to_string()))?;

    let html = tmpl
        .render(ctx)
        .map_err(|e| actix_web::error::ErrorInternalServerError(e.to_string()))?;

    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(html))
}

// Пример обработчика
async fn index() -> Result<HttpResponse, Error> {
    render_template(
        "index.html",
        context! {
            title => "Welcome!",
            name => "World",
        },
    )
}

async fn components() -> Result<HttpResponse, Error> {
    render_template(
        "components.html",
        context! {
            title => "Components Page",
        },
    )
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at http://127.0.0.1:8080");

    HttpServer::new(move || {
        App::new()
            .service(fs::Files::new("/static", "web/out/static").prefer_utf8(true))
            .route("/", web::get().to(index))
            .route("/components", web::get().to(components))
        // Здесь не нужно регистрировать TEMPLATES через.app_data(),
        // так как мы используем глобальный статический экземпляр.
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
