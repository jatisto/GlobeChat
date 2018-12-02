using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GlobChat.Globals
{
    static public class Global
    {
        public const string LoginRegex = "^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
        public const string PasswordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";

    }
}
