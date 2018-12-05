using GlobChat.api;
using GlobeChat.Interfaces;
using GlobeChat.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.IO;
using System;
//using SignalRChat.Hubs;

namespace GlobeChat
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration
        {
            get;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options => {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.                
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddDistributedMemoryCache();

            services.AddSession(options => {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromSeconds(1000);
                options.Cookie.HttpOnly = true;
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddDbContext<GlobeChatContext>(options =>
         options
         .UseSqlServer(Configuration.GetConnectionString("GlobChatContext"))
         .UseLazyLoadingProxies());
            services.AddSignalR();
            services.AddScoped<ChannelsControllerAPI>();
            services.AddHttpContextAccessor();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme);


            services.AddAuthentication().AddCookie(options => {
                options.LoginPath = new PathString("/Users/Login");
                options.AccessDeniedPath = new PathString("/Home/Error");
                options.ExpireTimeSpan = TimeSpan.FromDays(60);

            });

            services.AddSingleton<IDbContextAccessor, SignalRWebPack.Hubs.ChatHub>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseDeveloperExceptionPage();
            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseSession();
            app.UseDefaultFiles();
            app.UseCookiePolicy();
            app.UseStaticFiles();



            app.UseSignalR(routes => {
                routes.MapHub<SignalRWebPack.Hubs.ChatHub>("/hub");
            });

            app.UseMvc(routes => {
                routes.MapRoute(
                 name: "default",
                 template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}