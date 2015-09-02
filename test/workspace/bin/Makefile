.PHONY: all clean

CXX = g++
CXXFLAGS = -I../include
LIBS = -llinear -ltv -luv
LDFLAGS = -L../lib

all: testserver.cpp
	$(CXX) -o testserver $< $(CXXFLAGS) $(LIBS) $(LDFLAGS)

clean:
	@rm -f testserver *~
