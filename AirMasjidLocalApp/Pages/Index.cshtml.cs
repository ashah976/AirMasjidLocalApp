﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AirMasjidLocalApp.Pages
{

    [IgnoreAntiforgeryToken]


    public class IndexModel : PageModel
    {

        private readonly ILogger _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;


        }

//         string serial = "cat /proc/cpuinfo | grep Serial | awk '{print $3}'".Bash().Split(';').First();

        string serial = "00000000d86d6b5c";

        public void OnGet()
        {


        }

        public ContentResult OnPostGetUserPreferencesAsync()
        {


            var autoscreen = "";
            var tahajjud = "";
            int? establishid = null;
            int? events = null;
            int? viewmode = null;
            var establishname = "";
            var tweetid = "";
            var audiourl = "";
            var videocdn = "";
            var videourl = "";
            var cameradesc = "";
            int? micstatus = null;





            IConfigurationRoot configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();
            var connectionString = configuration.GetConnectionString("dbAirMasjid");


            try
            {
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    using (MySqlCommand cmd = new MySqlCommand("getuserpreferences", conn))
                    {

                        //  cmd.CommandText = "updateestablishment";

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        conn.Open();

                        var serialno = serial;
                        cmd.Parameters.AddWithValue("@serialno", serial);


                        MySql.Data.MySqlClient.MySqlDataReader myReader = default(MySql.Data.MySqlClient.MySqlDataReader);

                        myReader = cmd.ExecuteReader();

                        while (myReader.Read())
                        {

                            autoscreen = myReader.GetString(0);
                            tahajjud = myReader.GetString(1);
                            establishid = myReader.GetInt16(2);
                            events = myReader.GetInt16(3);
                            viewmode = myReader.GetInt16(4);
                            establishname = myReader.GetString(5);
                            tweetid = myReader.GetString(6);
                            audiourl = myReader.GetString(7);
                            videocdn = myReader.GetString(8);
                            videourl = myReader.GetString(9);
                            cameradesc = myReader.GetString(10);
                            micstatus = myReader.GetInt16(11);

                            //  establishid = myReader.GetString(2);
                          //  tblCameraLookup.Description,

                        }

                        // cmd.ExecuteNonQuery();
                        conn.Close();

                        //  return Content(autoscreen,tahajjud);

                        return Content("{ " +
                            "\"autoscreen\":" + "\"" + autoscreen + "\"" +
                            ",\"tahajjud\":" + "\"" + tahajjud + "\"" +
                            ",\"establishid\":" + establishid +
                            ",\"events\":" + events +
                            ",\"viewmode\":" + viewmode +
                            ",\"establishname\":" + "\"" + establishname + "\"" +
                            ",\"tweetid\":" + "\"" + tweetid + "\"" +
                            ",\"audiourl\":" + "\"" + audiourl + "\"" +
                            ",\"videocdn\":" + "\"" + videocdn + "\"" +
                            ",\"videourl\":" + "\"" + videourl + "\"" +
                            ",\"cameradesc\":" + "\"" + cameradesc + "\"" +
                            ",\"micstatus\":" + micstatus +
                            "}", "application/json");

                        //  return Content("{ \"name\":\"John\", \"age\":31, \"city\":\"New York\" }", "application/json");




                    }
                }
            }
            catch (Exception ex)
            {
                var Message = $"Failed to get user preferences " + ex.Message;
                _logger.LogWarning(Message);

                return Content("failed");

            }

        }


        public ContentResult OnPostCheckAudioAsync()
        {
            var audiourl = "";

            {
                MemoryStream stream = new MemoryStream();
                Request.Body.CopyTo(stream);
                stream.Position = 0;
                using (StreamReader reader = new StreamReader(stream))
                {
                    string requestBody = reader.ReadToEnd();
                    if (requestBody.Length > 0)
                    {
                        var obj = JsonConvert.DeserializeObject(requestBody);
                        if (obj != null)
                        {
                            audiourl = obj.ToString();

                        }
                    }
                }
            }




            string cmdcheckaudio = "[[ `omxplayer -i " + audiourl + " 2>&1 | grep Stream` ]] && echo 'running'";


            string audiourlstatus = cmdcheckaudio.Bash().Split(';').First();

            if (audiourlstatus == "running")
            {


                return Content("true");
            }
            else
            {
                return Content("false");
            }





        }

        public ContentResult OnPostCheckVideoAsync()
        {
            var videourl = "";

            {
                MemoryStream stream = new MemoryStream();
                Request.Body.CopyTo(stream);
                stream.Position = 0;
                using (StreamReader reader = new StreamReader(stream))
                {
                    string requestBody = reader.ReadToEnd();
                    if (requestBody.Length > 0)
                    {
                        var obj = JsonConvert.DeserializeObject(requestBody);
                        if (obj != null)
                        {
                            videourl = obj.ToString();

                        }
                    }
                }
            }

            string cmdcheckvideo = "[[ `omxplayer -i "+videourl +" 2>&1 | grep Stream | grep Video` ]] && echo 'running'";


            string videourlstatus = cmdcheckvideo.Bash().Split(';').First();

            if (videourlstatus == "running")
            {


                return Content("true");
            }
            else
            {
                return Content("false");
            }



        }


        public ContentResult OnPostGetPrayerTimesDailyAsync()
        {


            var month = "";   //April (convert to lowercase
            var date = "";    //22 


            {
                MemoryStream stream = new MemoryStream();
                Request.Body.CopyTo(stream);
                stream.Position = 0;
                using (StreamReader reader = new StreamReader(stream))
                {
                    string requestBody = reader.ReadToEnd();
                    if (requestBody.Length > 0)
                    {
                      
                        var obj = JObject.Parse(requestBody);
                        
                        if (obj != null)
                        {
                            date = obj["date"].ToString();
                            month = obj["month"].ToString().ToLower();
                            
                        }
                    }
                }
            }



            var fajr = "";
            var sunrise = "";
            var zawaal = "";
            var dhuhr = "";
            var asr = "";
            var maghrib = "";
            var isha = "";



          

            IConfigurationRoot configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();
            var connectionString = configuration.GetConnectionString("dbPrayerTimes-3");


            try
            {
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    using (MySqlCommand cmd = new MySqlCommand("getprayertimesdaily", conn))
                    {

                        //  cmd.CommandText = "updateestablishment";

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        conn.Open();

                       
                        cmd.Parameters.AddWithValue("@currmonth", month);
                        cmd.Parameters.AddWithValue("@currdate", date);


                        MySql.Data.MySqlClient.MySqlDataReader myReader = default(MySql.Data.MySqlClient.MySqlDataReader);

                        myReader = cmd.ExecuteReader();

                        while (myReader.Read())
                        {

                            fajr = myReader.GetString(0);
                            sunrise = myReader.GetString(1);
                            zawaal = myReader.GetString(2);
                            dhuhr = myReader.GetString(3);
                            asr = myReader.GetString(4);
                            maghrib = myReader.GetString(5);
                            isha = myReader.GetString(6);
                          

                            //  establishid = myReader.GetString(2);
                            //  tblCameraLookup.Description,

                        }

                        // cmd.ExecuteNonQuery();
                        conn.Close();

                        //  return Content(autoscreen,tahajjud);

                        return Content("{ " +
                            "\"fajr\":" + "\"" + fajr + "\"" +
                            ",\"sunrise\":" + "\"" + sunrise + "\"" +
                            ",\"zawaal\":" + "\""+zawaal + "\"" +
                            ",\"dhuhr\":" + "\"" + dhuhr + "\"" +
                            ",\"asr\":" + "\"" + asr + "\"" +
                            ",\"maghrib\":" + "\"" + maghrib + "\"" +
                            ",\"isha\":" + "\"" + isha + "\"" +
                            "}", "application/json");

                        //  return Content("{ \"name\":\"John\", \"age\":31, \"city\":\"New York\" }", "application/json");




                    }
                }
            }
            catch (Exception ex)
            {
                var Message = $"Failed to get daily prayer times " + ex.Message;
                _logger.LogWarning(Message);

                return Content("failed");

            }



        }




        public ContentResult OnPostGetPrayerTimesJamaatAsync()
        {

            var fajr = "";
            var dhuhr = "";
            var asr = "";
            var maghrib = "";
            var isha = "";
            var jummah1 = "";
            var jummah2 = "";

            IConfigurationRoot configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();
            var connectionString = configuration.GetConnectionString("dbPrayerTimes-3");


            try
            {
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    using (MySqlCommand cmd = new MySqlCommand("getjamaattimes", conn))
                    {

                        //  cmd.CommandText = "updateestablishment";

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        conn.Open();


                        MySql.Data.MySqlClient.MySqlDataReader myReader = default(MySql.Data.MySqlClient.MySqlDataReader);

                        myReader = cmd.ExecuteReader();

                        while (myReader.Read())
                        {

                            fajr = myReader.GetString(0);                         
                            dhuhr = myReader.GetString(1);
                            asr = myReader.GetString(2);
                            maghrib = myReader.GetString(3);
                            isha = myReader.GetString(4);
                            jummah1 = myReader.GetString(5);
                            jummah2 = myReader.GetString(6);
                            
                        }

                        // cmd.ExecuteNonQuery();
                        conn.Close();

                        //  return Content(autoscreen,tahajjud);

                        return Content("{ " +
                            "\"fajr\":" + "\"" + fajr + "\"" +
                            ",\"dhuhr\":" + "\"" + dhuhr + "\"" +
                            ",\"asr\":" + "\"" + asr + "\"" +
                            ",\"maghrib\":" + "\"" + maghrib + "\"" +
                            ",\"isha\":" + "\"" + isha + "\"" +
                              ",\"jummah1\":" + "\"" + jummah1 + "\"" +
                                ",\"jummah2\":" + "\"" + jummah2 + "\"" +
                            "}", "application/json");

                        //  return Content("{ \"name\":\"John\", \"age\":31, \"city\":\"New York\" }", "application/json");




                    }
                }
            }
            catch (Exception ex)
            {
                var Message = $"Failed to get user jamaat times " + ex.Message;
                _logger.LogWarning(Message);

                return Content("failed");

            }



        }






    }


}
        
