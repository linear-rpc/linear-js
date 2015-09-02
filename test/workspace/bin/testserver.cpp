#include <assert.h>
#include <unistd.h>

#include <cstdlib>
#include <iostream>
#include <string>

#include "linear/tcp_server.h"
#include "linear/timer.h"
#include "linear/group.h"
#include "linear/log.h"

class TestHandler : public linear::Handler {
public:
  TestHandler() : msgid_(12345) {}
  ~TestHandler() {}
  void OnConnect(const linear::Socket& socket) {}
  void OnMessage(const linear::Socket& socket, const linear::Message& message);

private:
  int Add(int a, int b) { return a + b; }
  int Sub(int a, int b) { return a - b; }
  int Mul(int a, int b) { return a * b; }
  int Div(int a, int b) { return a / b; }

  int msgid_;
};

void TestHandler::OnMessage(const linear::Socket& socket, const linear::Message& message) {
  switch(message.type) {
  case linear::REQUEST:
    {
      linear::Request request = message.as<linear::Request>();
      const std::string& method = request.method;
      linear::Response response;

      try {
        if (method == "add") {
          std::vector<int> recv_params = request.params.as<std::vector<int> >();
          int a = recv_params[0];
          int b = recv_params[1];
          response = linear::Response(request.msgid, Add(a, b));
        } else if (method == "sub") {
          std::vector<int> recv_params = request.params.as<std::vector<int> >();
          int a = recv_params[0];
          int b = recv_params[1];
          response = linear::Response(request.msgid, Sub(a, b));
        } else if (method == "mul") {
          std::vector<int> recv_params = request.params.as<std::vector<int> >();
          int a = recv_params[0];
          int b = recv_params[1];
          response = linear::Response(request.msgid, Mul(a, b));
        } else if (method == "div") {
          std::vector<int> recv_params = request.params.as<std::vector<int> >();
          int a = recv_params[0];
          int b = recv_params[1];
          response = linear::Response(request.msgid, Div(a, b));
        } else if (method == "long message") {
          std::vector<int> recv_params = request.params.as<std::vector<int> >();
          int a = recv_params[0];
          std::string result(a, 'a');
          response = linear::Response(request.msgid, result);
        } else if (method == "double") {
          std::vector<double> recv_params = request.params.as<std::vector<double> >();
          double result = recv_params[0];
          response = linear::Response(request.msgid, result);
        } else if (method == "string") {
          std::string result = request.params.as<std::string>();
          response = linear::Response(request.msgid, result);
        } else if (method == "string-binary" || method == "typed-array") {
          linear::type::binary result = request.params.as<linear::type::binary>();
          response = linear::Response(request.msgid, result);
        } else {
          response = linear::Response(request.msgid, linear::type::nil(), std::string("method not found"));
        }
      } catch(...) {
        response = linear::Response(request.msgid, linear::type::nil(), std::string("invalid parameter"));
      }
      response.Send(socket);
    }
    break;
  case linear::NOTIFY:
    {
      linear::Notify notify;
      linear::Notify recv = message.as<linear::Notify>();
      const std::string& method = recv.method;

      try {
        if (method == "dobroadcast") {
          notify = linear::Notify(method, recv.params.as<std::string>());
        } else if (method == "long message") {
          int a;
          std::vector<int> recv_params = recv.params.as<std::vector<int> >();
          a = recv_params[0];
          std::string data(a, 'a');
          notify = linear::Notify(std::string("long message broadcast"), data);
        } else if (method == "string-binary" || method == "typed-array") {
          linear::type::binary recv_params = recv.params.as<linear::type::binary>();
          notify = linear::Notify(method, recv_params);
        } else if (method == "request-success") {
          linear::Request request;
          do {
            request = linear::Request(std::string("success"), std::string("Success JS"));
          } while (request.msgid == msgid_);
          msgid_ = request.msgid;
          request.Send(socket);
          return;
        } else if (method == "request-fail") {
          linear::Request request;
          do {
            request = linear::Request(std::string("fail"), std::string("Fail JS"));
          } while (request.msgid == msgid_);
          msgid_ = request.msgid;
          request.Send(socket);
          return;
        }
      } catch (...) {
          notify = linear::Notify("XXX", std::string("XXX"));
      }
      notify.Send(LINEAR_BROADCAST_GROUP);
    }
    break;
  case linear::RESPONSE:
    {
      linear::Notify notify;
      linear::Response response = message.as<linear::Response>();
      if (response.error.is_nil()) {
        if (response.msgid == msgid_ && response.result.as<std::string>() == "Success JS") {
          notify = linear::Notify(std::string("request-test"), true);
        } else {
          notify = linear::Notify(std::string("request-test"), false);
        }
      } else {
        if (response.msgid == msgid_ && response.error.as<std::string>() == "Fail JS") {
          notify = linear::Notify(std::string("request-test"), true);
        } else {
          notify = linear::Notify(std::string("request-test"), false);
        }
      }
      notify.Send(socket);
    }
    break;
  default:
    assert(false);
    break;
  }
}

int main() {
#if 0
  linear::log::SetLevel(linear::log::LOG_DEBUG);
  linear::log::EnableStderr();
#endif
  TestHandler handler;
  linear::TCPServer server(handler);

  server.Start("127.0.0.1", 4227);
  while (true) {
    usleep(100);
  }
  server.Stop();
  return EXIT_SUCCESS;
}
