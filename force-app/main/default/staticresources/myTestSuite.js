describe("Lightning Component Testing Examples", function () {
    afterEach(function () {
        $T.clearRenderedTestComponents();
    });
    
    describe("A suite that tests the obvious", function() {
        it("spec that verifies that true is true", function() {
            expect(true).toBe(true);
        });
    });
});

describe('c:helloWorld', function () {
    it('verify component rendering', function (done) {
        $T.createComponent('c:helloWorld', {}, true)
            .then(function(cmp) {
                expect(cmp.find("message").getElement().innerHTML).toBe('Hello World!');
                done();
            }).catch(function (e) {
                done.fail(e);
            });
    });
});

describe('c:componentWithDataBinding', function () {
   it('verify data binding', function (done) {
      $T.createComponent('c:componentWithDataBinding', {message: 'Hello World!'}, true)
         .then(function (component) {
            expect(component.find("message").getElement().innerHTML).toBe('Hello World!');
            expect(component.find("messageInput").get("v.value")).toBe('Hello World!');
            done();
      }).catch(function (e) {
            done.fail(e);
      });
   });
});

describe("c:componentWithMethod", function() {
    it('verify method invocation', function(done) {
        $T.createComponent("c:componentWithMethod", {}, false)
            .then(function (component) {
                expect(component.get("v.counter")).toBe(0);
                component.increment();
                expect(component.get("v.counter")).toBe(1);
                done();
            }).catch(function (e) {
                done.fail(e);
            });
    });
});

describe('c:componentListeningToAppEvent', function () {
    it('verify application event', function (done) {
        $T.createComponent("c:componentListeningToAppEvent")
            .then(function (component) {
                $T.fireApplicationEvent("c:myAppEvent", {"message": "event fired"});
                expect(component.get("v.message")).toBe("event fired");
                done();
            }).catch(function (e) {
                done.fail(e);
            });
    });
});

describe('c:accountList', function () {
    it('verify server method invocation', function (done) {
        $T.createComponent("c:accountList")
            .then(function (component) {
		    expect(component.get("v.accounts").length).toBe(0);
                $T.run(component.loadAccounts);
                return $T.waitFor(function () {
                    return component.get("v.accounts").length === 3;
                })
            }).then(function () {
                done();
            }).catch(function (e) {
                done.fail(e);
            });
    });
});

describe('c:accountList', function () {
    it('verify mocked server method invocation', function (done) {
        $T.createComponent("c:accountList", {}, true)
            .then(function (component) {
                var mockResponse = { 
                    getState: function () { 
                        return "SUCCESS";
                    }, 
                    getReturnValue: function () { 
                        return [{"Name": "Account 1"}, {"Name": "Account 2"}]; 
                    } 
                };
                spyOn($A, "enqueueAction").and.callFake(function (action) {
                    var cb = action.getCallback("SUCCESS");
                    cb.fn.apply(cb.s, [mockResponse]);
                });
                component.loadAccounts();
                expect(component.get("v.accounts").length).toBe(2);
                expect(component.get("v.accounts")[0]['Name']).toContain("Account 1");
                done();
            }).catch(function (e) {
                done.fail(e);
            });
    });
});
