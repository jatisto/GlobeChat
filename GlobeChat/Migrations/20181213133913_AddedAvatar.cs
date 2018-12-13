using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace GlobeChat.Migrations
{
    public partial class AddedAvatar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invitations_User_receiverId",
                table: "Invitations");

            migrationBuilder.DropForeignKey(
                name: "FK_Invitations_User_senderId",
                table: "Invitations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Invitations",
                table: "Invitations");

            migrationBuilder.RenameTable(
                name: "Invitations",
                newName: "Conversations");

            migrationBuilder.RenameIndex(
                name: "IX_Invitations_senderId",
                table: "Conversations",
                newName: "IX_Conversations_senderId");

            migrationBuilder.RenameIndex(
                name: "IX_Invitations_receiverId",
                table: "Conversations",
                newName: "IX_Conversations_receiverId");

            migrationBuilder.AddColumn<string>(
                name: "hash",
                table: "Conversations",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Conversations",
                table: "Conversations",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Avatar",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: true),
                    image = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avatar", x => x.id);
                    table.ForeignKey(
                        name: "FK_Avatar_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Avatar_UserId",
                table: "Avatar",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_User_receiverId",
                table: "Conversations",
                column: "receiverId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_User_senderId",
                table: "Conversations",
                column: "senderId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_User_receiverId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_User_senderId",
                table: "Conversations");

            migrationBuilder.DropTable(
                name: "Avatar");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Conversations",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "hash",
                table: "Conversations");

            migrationBuilder.RenameTable(
                name: "Conversations",
                newName: "Invitations");

            migrationBuilder.RenameIndex(
                name: "IX_Conversations_senderId",
                table: "Invitations",
                newName: "IX_Invitations_senderId");

            migrationBuilder.RenameIndex(
                name: "IX_Conversations_receiverId",
                table: "Invitations",
                newName: "IX_Invitations_receiverId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Invitations",
                table: "Invitations",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Invitations_User_receiverId",
                table: "Invitations",
                column: "receiverId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Invitations_User_senderId",
                table: "Invitations",
                column: "senderId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
