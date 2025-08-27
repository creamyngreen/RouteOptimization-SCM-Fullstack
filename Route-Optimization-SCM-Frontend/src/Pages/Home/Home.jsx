import HomePage from "../../assets/Home/Logo/Homepage.png";
import OrangeRectangle from "../../assets/Home/Solution/OrangeRectangle.png";
import PlanExample from "../../assets/Home/Solution/PlanExample.png";
import clockIcon from "../../assets/Home/Solution/clockIcon.png";
import dashboardIcon from "../../assets/Home/Solution/dashboardIcon.png";
import historyIcon from "../../assets/Home/Solution/historyIcon.png";
import Services1 from "../../assets/Home/Services/Services1.png";
import truck from "../../assets/Home/WhyChooseUs/truck.png";
import truckIcon from "../../assets/Home/WhyChooseUs/truckIcon.png";
import mapIcon from "../../assets/Home/WhyChooseUs/mapIcon.png";
import integrationIcon from "../../assets/Home/WhyChooseUs/integrationIcon.png";
import fuelIcon from "../../assets/Home/WhyChooseUs/fuelIcon.png";
import companies from "../../assets/Home/WhyChooseUs/companies.png";
import face1 from "../../assets/Home/WhyChooseUs/face1.png";
import face2 from "../../assets/Home/WhyChooseUs/face2.png";
import feedbackIcon1 from "../../assets/Home/WhyChooseUs/feedbackIcon1.png";
import feedbackIcon2 from "../../assets/Home/WhyChooseUs/feedbackIcon2.png";
import star from "../../assets/Home/WhyChooseUs/star.png";
import new1 from "../../assets/Home/News/new1.jpg";
import new2 from "../../assets/Home/News/new2.jpg";
import new3 from "../../assets/Home/News/new3.png";
import leftarrowIcon from "../../assets/Home/News/leftarrowIcon.png";
import rightarrowIcon from "../../assets/Home/News/rightarrowIcon.png";
import whiterightarrowIcon from "../../assets/Home/News/whiterightarrowIcon.png";
import background from "../../assets/Home/ContactUs/background.png";
import clock from "../../assets/Home/ContactUs/clock.png";
import telephone from "../../assets/Home/ContactUs/telephone.png";
import mail from "../../assets/Home/ContactUs/mail.png";

const Home = () => {
  return (
    <div>
      <div className="flex justify-between p-10">
        <div className="flex flex-col space-y-4 ml-28">
          <h1 className="text-8xl font-bold font-poppins">
            Optimize Your Delivery Routes
            <br />
            with AI Precision
          </h1>
          <p className="text-xl font-quattrocento">
            Save up to 30% on fuel costs and
            <br />
            reduce delivery times with our
            <br />
            all-in-one route optimization platform.
          </p>
          <button
            style={{ width: "10rem", height: "3.5rem" }}
            className="mt-4 bg-[#FD7E14] text-white text-xl py-2 px-4 rounded font-bold font-quattrocento"
          >
            Start Free Trial
          </button>
        </div>

        <div>
          <img
            src={HomePage}
            alt="Delivery Optimization"
            style={{ width: "70rem", height: "35rem", marginRight: "550px" }}
            className=""
          />
        </div>
      </div>

      <div className="relative">
        <img src={OrangeRectangle} alt="Orange Rectangle" className="w-full" />
        <div className="absolute top-6 left-0 w-full h-full flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span
              className="font-manrope text-transparent bg-clip-text font-extrabold text-6xl"
              style={{
                background:
                  "linear-gradient(to right, #010B1A 14%, #1078AB 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              1B+
            </span>
            <span className="font-lato mt-2 font-semibold text-lg ">
              Miles Optimized
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span
              className="font-manrope text-transparent bg-clip-text font-extrabold text-6xl"
              style={{
                background:
                  "linear-gradient(to right, #010B1A 0%, #1078AB 95%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              200M+
            </span>
            <span className="font-lato mt-2 font-semibold text-lg">
              Stop Visited
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span
              className="font-manrope text-transparent bg-clip-text font-extrabold text-6xl"
              style={{
                background:
                  "linear-gradient(to right, #3B3D43 25%, #288184 92%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              30M+
            </span>
            <span className="font-lato mt-2 font-semibold text-lg">
              Route Planned
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span
              className="font-manrope text-transparent bg-clip-text font-extrabold text-6xl"
              style={{
                background:
                  "linear-gradient(to right, #010B1A 0%, #1078AB 95%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              50K+
            </span>
            <span className="font-lato mt-2 font-semibold text-lg">
              Happy Customers
            </span>
          </div>
        </div>
      </div>

      <div id="solution" className="text-center mt-10">
        <p className="text-[#E37A34] font-semibold font-lato text-4xl">
          AI-Powered Route Planning Solution
        </p>
        <p className="font-semibold font-urbanist text-3xl mt-5">
          Simplify complex routes and fleet management in just 3 seconds!
        </p>
      </div>

      <img
        src={PlanExample}
        alt="Plan Example"
        style={{ width: "103rem" }}
        className="p-6 mx-auto "
      />

      <div className="text-center mt-10">
        <p className="text-[#FD7E14] font-black font-urbanist text-3xl">
          HOW IT WORKS?
        </p>
        <p className="font-bold font-urbanist text-5xl mt-5">
          A seamless solution to <br />
          optimize every aspect of your delivery process.
        </p>
      </div>

      <div className="flex justify-between items-start space-x-16 mt-12 px-16 mx-20">
        <div
          className="w-2/5 h-80 p-6 rounded-[24px] bg-white"
          style={{
            border: "2px solid transparent",
            backgroundImage:
              "linear-gradient(white, white), linear-gradient(90deg, #C5ECFF 0%, #95DDFF 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <img
            src={clockIcon}
            alt="Clock Icon"
            className="my-8 w-8 h-8 bg-[#EFF9FF]"
          />
          <h2 className="text-[#003278] font-bold text-2xl font-lato">
            Input Your Delivery Details
          </h2>
          <p className="mt-2 text-xl font-lato">
            Enter your delivery addresses, specify time windows, and assign
            priorities. Our platform integrates with your existing logistics
            systems to make data input easy and seamless.
          </p>
        </div>

        <div
          className="w-2/5 h-80 p-6 rounded-[24px] bg-white"
          style={{
            border: "2px solid transparent",
            backgroundImage:
              "linear-gradient(white, white), linear-gradient(90deg, #C5ECFF 0%, #95DDFF 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <img
            src={dashboardIcon}
            alt="Dashboard Icon"
            className="my-8 w-8 h-8"
          />
          <h2 className="text-[#035E89] font-bold text-2xl font-lato">
            Generate Optimized Routes
          </h2>
          <p className="mt-2 text-xl font-lato">
            With one click, our algorithm calculates the most efficient routes
            based on traffic, weather, driver schedules, and your priorities.
            Watch the routes appear instantly on your dashboard.
          </p>
        </div>

        <div
          className="w-2/5 h-80 p-6 rounded-[24px] bg-white"
          style={{
            border: "2px solid transparent",
            backgroundImage:
              "linear-gradient(white, white), linear-gradient(90deg, #C5ECFF 0%, #95DDFF 100%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <img
            src={historyIcon}
            alt="History Icon"
            className="my-8 w-8 h-8 bg-[#EFF9FF]"
          />
          <h2 className="text-[#035E89] font-bold text-2xl font-lato">
            Track Deliveries in Real Time
          </h2>
          <p className="mt-2 text-xl font-lato">
            Monitor your drivers as they move along their routes, make
            adjustments in real time, and keep customers updated with accurate
            delivery windows.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-10">
        <button
          style={{ width: "10rem", height: "3.5rem" }}
          className="bg-[#FD7E14] text-white text-xl py-2 px-4 rounded font-bold font-lato"
        >
          Get Start {">"}
        </button>
      </div>

      <div className="bg-[#F4F4F4] h-[110rem]">
        <div className=" bg-[#F4F4F4] text-left mt-20 ml-28 p-5">
          <p
            id="services"
            className="text-[#FD7E14] font-black font-urbanist text-3xl"
          >
            OUR SERVICES
          </p>
          <p className="font-bold font-urbanist text-5xl mt-5">
            No more manual planning
            <br />
            Let EffiRoute take the guesswork!
          </p>
        </div>

        <div className="flex p-5 -mt-7">
          {/* First section*/}
          <div className="flex flex-col space-y-4 ml-28 mt-5 ">
            <h1 className="text-4xl font-bold font-lato text-[#FD7E14] pt-8">
              Smart Route Optimization
            </h1>
            <p className="text-2xl font-lato font-light">
              Automatically calculate the most efficient routes for your
              <br />
              drivers based on real-time traffic, weather conditions, and <br />{" "}
              delivery priorities.
            </p>
            <div>
              <ul className="list-disc list-inside ml-2 py-2 text-3xl mt-5 ">
                <li className="font-semibold font-lato whitespace-nowrap mb-2">
                  Save fuel and reduce operational costs.
                </li>
                <li className="font-semibold font-lato whitespace-nowrap">
                  Adjust routes on the fly based on real-time updates.
                </li>
              </ul>
            </div>
            <div>
              <button
                style={{ width: "10rem", height: "3.5rem" }}
                className="mt-5 bg-[#FD7E14] text-white text-xl py-2 px-4 rounded font-bold font-lato"
              >
                Read more {">"}
              </button>
            </div>
          </div>

          <div>
            <img
              src={Services1}
              alt="Services1"
              style={{
                width: "43rem",
                height: "24.2rem",
                marginLeft: "12.5rem",
              }}
              className=" mt-10"
            />
          </div>
        </div>

        <div className="flex p-5 mt-16">
          {/* Second section*/}
          <div className="ml-28">
            <img
              src={Services1}
              alt="Services1"
              style={{ width: "43rem", height: "24.2rem" }}
              className="mt-10"
            />
          </div>

          <div className="flex flex-col space-y-4 ml-32 mt-5">
            <h1 className="text-4xl font-bold font-lato text-[#FD7E14] pt-8">
              Real-Time Delivery Tracking
            </h1>
            <p className="text-2xl font-lato font-light">
              Monitor your fleet in real time. Track the location of every
              <br />
              vehicle, monitor delivery progress, and quickly respond to any
              <br /> delays or re-routing needs.
            </p>
            <div>
              <ul className="list-disc list-inside ml-2 py-2 mt-5 text-3xl">
                <li className="font-semibold font-lato whitespace-nowrap mb-2">
                  Live tracking on an interactive map.
                </li>
                <li className="font-semibold font-lato whitespace-nowrap">
                  Immediate notifications for delays or route changes.
                </li>
              </ul>
            </div>
            <div>
              <button
                style={{ width: "10rem", height: "3.5rem" }}
                className="mt-5 bg-[#FD7E14] text-white text-xl py-2 px-4 rounded font-bold font-lato"
              >
                Read more {">"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex p-5 mt-16">
          {/* Third section*/}
          <div className="flex flex-col space-y-4 ml-28 mt-5 ">
            <h1 className="text-4xl font-bold font-lato text-[#FD7E14] pt-8">
              Multi-Driver Management
            </h1>
            <p className="text-2xl font-lato font-light">
              Easily assign drivers to optimized routes & manage multiple
              <br />
              deliveries simultaneously. Whether you’re managing a small
              <br /> fleet or coordinating hundreds of drivers, our platform
              <br /> scales with your needs.
            </p>
            <div>
              <ul className="list-disc list-inside ml-2 py-2 text-3xl mt-5 ">
                <li className="font-semibold font-lato whitespace-nowrap mb-2">
                  {" "}
                  Centralized dashboard for multi-driver dispatching.
                </li>
                <li className="font-semibold font-lato whitespace-nowrap">
                  Full control over delivery schedules and driver shifts.
                </li>
              </ul>
            </div>
            <div>
              <button
                style={{ width: "10rem", height: "3.5rem" }}
                className="mt-5 bg-[#FD7E14] text-white text-xl py-2 px-4 rounded font-bold font-lato"
              >
                Read more {">"}
              </button>
            </div>
          </div>

          <div>
            <img
              src={Services1}
              alt="Services1"
              style={{
                width: "43rem",
                height: "24.2rem",
                marginLeft: "12.5rem",
              }}
              className=" mt-[4.4rem]"
            />
          </div>
        </div>
      </div>
      <div className="relative">
        <p
          id="whychooseus"
          className="text-[#FD7E14] font-black font-urbanist text-4xl text-center mt-10"
        >
          WHY EFFIROUTE?
        </p>
        <div className="flex justify-end items-center mt-10 mr-28">
          <img src={truck} alt="Truck Background" className="w-4/6 h-auto" />
        </div>
        <div
          style={{
            position: "absolute",
            top: "16.5rem",
            left: "-16rem",
            height: "30rem",
            width: "30rem",
          }}
          className="px-8 py-10 ml-96 bg-[#FD7E14] text-white rounded-t-lg rounded-l-lg"
        >
          <p className="text-[40px] font-urbanist font-bold">
            From route optimization to real-time tracking, we provide everything
            you need to streamline your deliveries.
          </p>
        </div>

        <div
          style={{ position: "absolute", right: "10rem", top: "18rem" }}
          className="flex-col space-y-4"
        >
          <div className="flex items-center bg-[#2169B8] rounded-r-full w-8/12 h-auto p-2">
            <img src={mapIcon} alt="Map Icon" className="w-10 h-10 mr-4" />
            <div>
              <p className="font-bold text-white font-lato text-2xl">
                Boost On-Time Deliveries
              </p>
              <p className="text-white font-lato text-xl">
                With accurate route planning and real-time adjustments, you can
                significantly reduce late deliveries.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[#2169B8] rounded-r-full w-8/12 h-auto p-2">
            <img src={fuelIcon} alt="Fuel Icon" className="w-10 h-10 mr-4" />
            <div>
              <p className="font-bold text-white font-lato text-2xl">
                Reduce Fuel Costs by Up to 30%
              </p>
              <p className="text-white font-lato text-xl">
                Our algorithm ensures that your drivers take the shortest, most
                fuel-efficient routes possible.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[#2169B8] rounded-r-full w-8/12 h-auto p-2">
            <img src={truckIcon} alt="Truck Icon" className="w-10 h-10 mr-4" />
            <div>
              <p className="font-bold font-lato text-white text-2xl">
                Improve Driver Efficiency
              </p>
              <p className="text-white font-lato">
                By automating route planning, drivers can focus on driving, not
                logistics. This leads to faster, stress-free deliveries.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[#2169B8] rounded-r-full w-8/12 h-auto p-2">
            <img
              src={integrationIcon}
              alt="Integration Icon"
              className="w-10 h-10 mr-4"
            />
            <div>
              <p className="font-bold font-lato text-white text-2xl">
                Seamless Integrations with Your System
              </p>
              <p className="text-white font-lato text-xl">
                Easily integrates with the software you’re already using,
                allowing to streamline operations without disrupting your
                workflow.
              </p>
            </div>
          </div>
        </div>
        <p className="text-[#595959] font-semibold font-urbanist text-5xl text-center mt-20 ">
          Trusted by leaders around the world
        </p>
        <img src={companies} alt="Companies" className="w-full h-auto mr-4" />
      </div>

      <div className="flex justify-center space-x-8 mt-10">
        <div
          style={{ width: "30rem" }}
          className="group bg-white p-6 shadow-lg hover:bg-[#F1580C]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={face1}
                alt="Mark Zuckerberg"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="text-xl font-bold font-lato text-[#091242] group-hover:text-white">
                  Mark Zuckerberg
                </p>
                <p className="text-lg text-[#091242] group-hover:text-white">
                  Logistics Director, Fast Track Shipping
                </p>
              </div>
            </div>

            <img
              src={feedbackIcon1}
              alt="Feedback Icon"
              className="w-8 h-8 group-hover:hidden"
            />
            <img
              src={feedbackIcon2}
              alt="Feedback Icon"
              className="w-8 h-8 hidden group-hover:block"
            />
          </div>

          <p className="text-xl text-[#666C89] italic font-lato mb-4 group-hover:text-white">
            Our fleet efficiency has never been better. We’re delivering faster
            and using less fuel, thanks to EFFIROUTE !!!
          </p>

          <div className="flex space-x-1 mb-4">
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
          </div>
        </div>

        <div
          style={{ width: "30rem" }}
          className="group bg-white p-6 shadow-lg hover:bg-[#F1580C]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={face2}
                alt="Elon Musk"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="text-xl font-bold font-lato text-[#091242] group-hover:text-white">
                  Elon Musk
                </p>
                <p className="text-lg text-[#091242] group-hover:text-white">
                  Logistics Director, Fast Track Shipping
                </p>
              </div>
            </div>

            <img
              src={feedbackIcon1}
              alt="Feedback Icon"
              className="w-8 h-8 group-hover:hidden"
            />
            <img
              src={feedbackIcon2}
              alt="Feedback Icon"
              className="w-8 h-8 hidden group-hover:block"
            />
          </div>

          <p className="text-xl text-[#666C89] italic font-lato mb-4 group-hover:text-white">
            Managing hundreds of deliveries a day used to be chaotic, but now
            it’s a breeze. Our drivers love the easy-to-use app, and we love the
            cost savings.
          </p>

          <div className="flex space-x-1 mb-4">
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
            <img src={star} alt="star" className="w-5 group-hover:text-white" />
          </div>
        </div>
      </div>

      <div className="bg-[#d4cece] mt-20">
        {/* News */}
        <div className="container mx-auto py-8 ml-28">
          <h2 id="news" className="text-3xl font-bold text-[#FD7E14] mb-6 ml-4">
            FEATURE NEWS
          </h2>
          <div className="flex">
            <div className="flex flex-col space-y-10 w-2/3 ">
              {/* News Item 1 */}
              <div className="flex rounded-lg  overflow-hidden">
                <div className="w-3/6 p-4">
                  <h3 className="text-2xl text-[#272728] font-semibold font-lato">
                    EffiRoute cung cấp dịch vụ gom hàng lẻ và chuyển hàng nguyên
                    container
                  </h3>
                  <p className="text-gray-600 text-xl mt-2 font-lato">
                    EffiRoute cung cấp dịch vụ gom hàng lẻ và chuyển hàng nguyên
                    container Hàng lẻ (LCL – Less than Container Load) và Hàng
                    […]
                  </p>
                </div>
                <img
                  src={new1}
                  alt="Feature News 1"
                  className="w-2/6 h-5/6 object-cover rounded-lg mt-6"
                />
              </div>

              {/* News Item 2 */}
              <div className="flex rounded-lg overflow-hidden">
                <div className="w-3/6 p-4">
                  <h3 className="text-2xl font-semibold font-lato">
                    EffiRoute cung cấp dịch vụ gom hàng lẻ và chuyển hàng nguyên
                    container
                  </h3>
                  <p className="text-gray-600 text-xl mt-2 font-lato">
                    EffiRoute cung cấp dịch vụ gom hàng lẻ và chuyển hàng nguyên
                    container Hàng lẻ (LCL – Less than Container Load) và Hàng
                    […]
                  </p>
                </div>
                <img
                  src={new2}
                  alt="Feature News 2"
                  className="w-2/6 h-5/6 object-cover rounded-lg mt-6"
                />
              </div>

              {/* News Item 3 */}
              <div className="flex  rounded-lg overflow-hidden">
                <div className="w-3/6 p-4">
                  <h3 className="text-2xl font-semibold font-lato">
                    EffiRoute cung cấp dịch vụ gom hàng lẻ và vận chuyển hàng
                    nguyên container
                  </h3>
                  <p className="text-gray-600 text-xl mt-2 font-lato">
                    EffiRoute cung cấp dịch vụ gom hàng lẻ và chuyển hàng nguyên
                    container Hàng lẻ (LCL – Less than Container Load) và Hàng
                    […]
                  </p>
                </div>
                <img
                  src={new3}
                  alt="Feature News 3"
                  className="w-2/6 h-5/6 object-cover rounded-lg mt-6"
                />
              </div>
            </div>

            {/* News Item 4*/}
            <div className="flex flex-col w-3/6  rounded-lg overflow-hidden">
              <img
                src={new1}
                alt="Feature News 4"
                className="w-full h-[34.5rem]  object-cover rounded-lg"
              />
              <div className="p-4">
                <h3 className="text-2xl font-semibold font-lato">
                  EffiRoute cung cấp dịch vụ gom hàng lẻ và vận chuyển hàng
                  nguyên container
                </h3>
                <p className="text-gray-600 mt-2 text-xl font-lato">
                  EffiRoute cung cấp dịch vụ gom hàng lẻ và chuyển hàng nguyên
                  container Hàng lẻ (LCL – Less than Container Load) và Hàng […]
                </p>
              </div>

              {/* Pagination Buttons */}
              <div className="justify-end flex">
                <div className="flex justify-center space-x-4 mt-4">
                  {/* Left Button */}
                  <button className="group w-12 h-12 mt-2 bg-white border border-[#595959] rounded-full flex items-center justify-center transition duration-300 hover:bg-red-500 hover:border-transparent">
                    <img
                      src={leftarrowIcon}
                      alt="Left Arrow"
                      className="w-5 h-5 transition duration-300 group-hover:filter group-hover:brightness-0 group-hover:invert"
                    />
                  </button>

                  {/* Right Button */}
                  <button className="group w-12 h-12 mt-2 bg-white border border-[#595959] rounded-full flex items-center justify-center transition duration-300 hover:bg-red-500 hover:border-transparent">
                    <img
                      src={rightarrowIcon}
                      alt="Right Arrow"
                      className="w-5 h-5 transition duration-300 group-hover:filter group-hover:brightness-0 group-hover:invert"
                    />
                  </button>

                  {/* See All Button */}
                  <button className="group bg-[#FD7E14] text-white text-lg px-4 py-4 rounded-full font-bold font-roboto flex items-center ">
                    <span>See all</span>
                    <img
                      src={whiterightarrowIcon}
                      alt="Right Arrow"
                      className="w-5 h-5 ml-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="pricing" className="text-center mt-10">
        <p className="text-[#FD7E14] font-black font-urbanist text-4xl">
          OUR PRICING PLANS?
        </p>
        <p className="font-bold font-urbanist text-3xl mt-5">
          Flexible Options for Every Business Size
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="container mx-auto py-8 mb-16">
        <div className="flex justify-center space-x-20">
          {/* Basic Plan */}
          <div className="bg-white border-[#EF720A] border-2 rounded-lg shadow-lg p-6 w-96 h-[30rem] text-center">
            <h3 className="text-4xl font-semibold font-lato text-[#073262] mt-6">
              Basic Plan
            </h3>
            <p className="text-[#595959] mt-1 font-lato italic text-2xl">
              Essentials for Small Teams
            </p>
            <p className="mt-4">
              <span className="text-3xl font-bold font-lato text-[#FD7E14]">
                $
              </span>
              <span className="text-5xl font-bold font-lato text-[#FD7E14]">
                19,99
              </span>
              <span className="text-base font-bold font-lato text-[#FD7E14]">
                /month
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-xl list-inside list-disc flex flex-col items-start font-lato mb-5 text-[#595959] ">
              <li className="pl-12">Essential Route Optimization</li>
              <li className="pl-12">Up to 10 Active Routes</li>
              <li className="pl-12">Priority E-mail Support</li>
            </ul>
            <button className="mt-6 bg-[#49C549] text-white py-3 px-4 rounded-lg text-xl font-lato font-bold">
              Get Basic
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border-[#EF720A] border-2 rounded-lg shadow-lg p-6 w-96 relative text-center">
            <span className="absolute top-0 right-0 bg-blue-500 text-white text-xl font-bold rounded-full px-2 py-3 transform -translate-y-1/2 translate-x-1/2 rotate-12">
              Most Popular!
            </span>
            <h3 className="text-4xl font-semibold font-lato text-[#073262] mt-6">
              Pro Plan
            </h3>
            <p className="text-[#595959] mt-1 text-xl font-lato italic text-nowrap">
              Advanced Tools for Growing Businesses
            </p>
            <p className="mt-4">
              <span className="text-3xl font-bold font-lato text-[#FD7E14]">
                $
              </span>
              <span className="text-5xl font-bold font-lato text-[#FD7E14]">
                49.99
              </span>
              <span className="text-base font-bold font-lato text-[#FD7E14]">
                /month
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-xl list-inside list-disc flex flex-col items-start font-lato mb-5 text-[#595959] ">
              <li className="pl-9">Advanced Optimization</li>
              <li className="pl-9">Unlimited Route Planning</li>
              <li className="pl-9">24/7 Priority Support</li>
            </ul>
            <button className="mt-6 bg-[#49C549] text-white py-3 px-4 text-xl rounded-lg font-lato font-bold">
              Get Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border-[#EF720A] border-2 rounded-lg shadow-lg p-6 w-96 text-center">
            <h3 className="text-4xl font-semibold font-lato text-[#073262] mt-6">
              Enterprise Plan
            </h3>
            <p className="font-lato text-3xl mt-1 text-[#FD7E14] font-bold text-pretty">
              Flexible Price to fit your needs
            </p>
            <ul className="mt-8 space-y-2 text-xl list-inside list-disc flex flex-col items-start font-lato mb-5 text-[#595959] ">
              <li className="pl-9">Advanced Optimization</li>
              <li className="pl-9">Unlimited Route Planning</li>
              <li className="pl-9">24/7 Priority Support</li>
            </ul>
            <button className="mt-6 bg-[#49C549] text-white py-3 px-4 rounded-lg text-xl font-lato font-bold">
              Contact us
            </button>
          </div>
        </div>
      </div>

      {/* Contact Us */}
      <div className="relative flex flex-col lg:flex-row">
        <img
          src={background}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative container mx-auto flex flex-col lg:flex-row items-start justify-between text-white p-8 space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Left Side: Contact Information */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-4">
            <h2 className="text-4xl font-bold mb-4 text-[#FD7E14] font-poppins">
              CONTACT US
            </h2>
            <p className="text-lg mb-8 font-lato">
              Ready to streamline your shipping operations? Contact us today to
              discuss your needs and discover how EffiRoute can elevate your
              cargo transportation experience.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center mr-auto">
                <div className="w-12 h-12 border border-[#FD7E14] rounded-full flex items-center justify-center mr-3">
                  <img src={mail} alt="Email" className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm">contact@effiroute.com</p>
                </div>
              </div>

              <div className="flex items-center mr-auto">
                <div className="w-12 h-12 border border-[#FD7E14] rounded-full flex items-center justify-center mr-3">
                  <img src={telephone} alt="Telephone" className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Call us</p>
                  <p className="text-sm">0123456789</p>
                </div>
              </div>

              <div className="flex items-center mr-auto">
                <div className="w-12 h-12 border border-[#FD7E14] rounded-full flex items-center justify-center mr-3">
                  <img src={clock} alt="Clock" className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Mon - Sat 9.00 - 18.00</p>
                </div>
              </div>
            </div>
          </div>

          {/*Input Form */}
          <div className="w-full lg:w-1/2 p-6">
            <form className="flex flex-col space-y-4 font-inter mt-5">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Your Name*"
                  className="border border-white p-2 flex-1 placeholder-white bg-transparent focus:outline-none "
                  required
                />
                <input
                  type="email"
                  placeholder="Email*"
                  className="border placeholder-white border-white p-2 flex-1 bg-transparent focus:outline-none "
                  required
                />
              </div>
              <div className="flex space-x-4">
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  className="border border-white p-2 flex-1 bg-transparent placeholder-white focus:outline-none "
                  required
                />
                <input
                  type="text"
                  placeholder="City*"
                  className="border border-white p-2 flex-1 bg-transparent placeholder-white focus:outline-none "
                  required
                />
              </div>
              <textarea
                placeholder="Your Message"
                className="border border-white p-2 bg-transparent placeholder-white focus:outline-none"
                rows="4"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-[#F1580C] w-1/4 text-white py-2 ml-auto"
              >
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
