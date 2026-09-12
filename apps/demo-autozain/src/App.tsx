import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CarDetail } from './components/CarDetail';
import { ContactRequestModal } from './components/ContactRequestModal';
import { Icon } from './components/Icon';
import { MarketplaceView } from './components/MarketplaceView';
import { PersonaSwitch } from './components/PersonaSwitch';
import { RequestConfirmation } from './components/RequestConfirmation';
import { StaffDashboard } from './components/StaffDashboard';
import type { CarSummary, CompletionOutcome, ContactRequest, CreateContactRequestInput, DemoSnapshot, Employee, Persona } from './domain/types';
import { isEmbedded, postDemoMessage } from './frameBridge';
import { AutoZainDemoService } from './services/autozainDemoService';

type BuyerRoute = 'cars' | 'detail' | 'employees';

export default function App() {
  const serviceRef = useRef<AutoZainDemoService | null>(null);
  if (!serviceRef.current) serviceRef.current = new AutoZainDemoService();
  const service = serviceRef.current;
  const [snapshot, setSnapshot] = useState<DemoSnapshot>(() => service.getSnapshot());
  const [persona, setPersona] = useState<Persona>('buyer');
  const [route, setRoute] = useState<BuyerRoute>('cars');
  const [selectedCarId, setSelectedCarId] = useState(snapshot.cars[0]?.id ?? '');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => service.subscribe((_event, nextSnapshot) => setSnapshot(nextSnapshot)), [service]);
  useEffect(() => () => service.dispose(), [service]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => postDemoMessage('READY'));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || selectedEmployee) return;
      postDemoMessage('REQUEST_CLOSE');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedEmployee]);

  const selectedCar = useMemo(() => snapshot.cars.find((car) => car.id === selectedCarId) ?? snapshot.cars[0], [selectedCarId, snapshot.cars]);
  const latestRequest = snapshot.requests.at(-1);
  const requestEmployee = latestRequest ? snapshot.employees.find((employee) => employee.id === latestRequest.employeeId) : undefined;
  const requestCar = latestRequest ? snapshot.cars.find((car) => car.id === latestRequest.interestedCarId) : undefined;
  const staffEmployee = snapshot.employees.find((employee) => employee.id === 'demo-staff-11') ?? snapshot.employees[0];

  const changePersona = useCallback((next: Persona) => {
    setSelectedEmployee(null);
    setPersona(next);
    postDemoMessage('STEP_CHANGED', {
      guidance: next === 'staff'
        ? 'Accept the pending local request, then record one of the source-supported outcomes.'
        : 'Browse a fictional vehicle and inspect the same request state from the buyer view.',
    });
  }, []);

  async function createRequest(input: CreateContactRequestInput) {
    await service.createRequest(input);
    setSelectedEmployee(null);
    setRoute('employees');
    postDemoMessage('STEP_CHANGED', { guidance: 'The buyer request is pending. Switch to Staff to accept it before the short local timeout.' });
  }

  async function acceptRequest(id: string) {
    await service.respond(id, 'accept');
    postDemoMessage('STEP_CHANGED', { guidance: 'The request is accepted and the sample employee is busy. Choose an outcome to finish the session.' });
  }

  async function rejectRequest(id: string) {
    await service.respond(id, 'reject');
    postDemoMessage('STEP_CHANGED', { guidance: 'The request was rejected without opening a staff session. Reset to repeat the main acceptance path.' });
  }

  async function completeRequest(id: string, outcome: CompletionOutcome) {
    await service.complete(id, outcome);
    postDemoMessage('COMPLETE', { guidance: 'The outcome is recorded locally and the employee is available again. Switch personas to verify continuity.' });
  }

  function resetDemo() {
    service.reset();
    setPersona('buyer');
    setRoute('cars');
    setSelectedCarId(service.getSnapshot().cars[0]?.id ?? '');
    setSelectedEmployee(null);
    postDemoMessage('STEP_CHANGED', { guidance: 'The fictional inventory, personas, request history, events, and timers were reset.' });
  }

  function selectCar(car: CarSummary) {
    setSelectedCarId(car.id);
    setRoute('detail');
  }

  if (!selectedCar || !staffEmployee) return null;

  return (
    <div className="demo-root" data-persona={persona} data-request-status={latestRequest?.status ?? 'none'}>
      <section className="demo-control-bar" dir="ltr" aria-label="Demo controls">
        <div className="simulation-label"><span className="pulse-dot" />Simulated events · Sample data</div>
        <PersonaSwitch persona={persona} onChange={changePersona} />
        {!isEmbedded && (
          <div className="standalone-actions">
            <button type="button" onClick={resetDemo}><Icon name="reset" />Reset</button>
            <a href="/work/autozain/">Back to portfolio</a>
          </div>
        )}
      </section>

      {persona === 'buyer' ? (
        <div className="buyer-shell">
          <header className="public-header">
            <button type="button" className="brand" onClick={() => setRoute('cars')}><Icon name="car" /> أوتوزين</button>
            <nav aria-label="Buyer demo navigation">
              <button type="button" className={route === 'cars' ? 'active' : ''} onClick={() => setRoute('cars')}>العربيات</button>
              <button type="button" onClick={() => setRoute('cars')}><Icon name="heart" /> المفضلة</button>
              <button type="button" className={route === 'employees' ? 'contact-nav' : ''} onClick={() => setRoute('employees')}><Icon name="user" /> تواصل مع موظف</button>
            </nav>
          </header>

          {route === 'cars' && <MarketplaceView cars={snapshot.cars} onSelect={selectCar} />}
          {route === 'detail' && <CarDetail car={selectedCar} onBack={() => setRoute('cars')} onContact={() => setRoute('employees')} />}
          {route === 'employees' && (
            <main className="employees-view" id="main-content">
              <div className="employees-heading"><Icon name="user" /><h1>تواصل مع موظف</h1><p>اختار موظف متاح واحنا هنحفظ الطلب داخل تجربة المتصفح.</p></div>
              {latestRequest && requestEmployee && requestCar && (
                <RequestConfirmation
                  request={latestRequest}
                  employee={requestEmployee}
                  car={requestCar}
                  timeoutMs={service.timeoutMs}
                  onStaff={() => changePersona('staff')}
                  onTimeout={() => service.advanceClock(service.timeoutMs)}
                />
              )}
              <div className="employee-list">
                {snapshot.employees.map((employee) => (
                  <article className="employee-card" key={employee.id}>
                    <div className="avatar">{employee.fullName[0]}</div>
                    <div><strong>{employee.fullName}</strong><span className={`employee-status ${employee.status}`}><i />{employee.status === 'busy' ? 'مشغول' : 'متاح'}</span></div>
                    <button type="button" className="primary-button" disabled={employee.status !== 'available' || latestRequest?.status === 'pending' || latestRequest?.status === 'accepted'} onClick={() => setSelectedEmployee(employee)}>تواصل</button>
                  </article>
                ))}
              </div>
            </main>
          )}
          <footer className="public-footer">أوتوزين · تجربة محلية ببيانات وصور خيالية</footer>
          {selectedEmployee && <ContactRequestModal employee={selectedEmployee} car={selectedCar} onClose={() => setSelectedEmployee(null)} onSubmit={createRequest} />}
        </div>
      ) : (
        <StaffDashboard
          employee={staffEmployee}
          requests={snapshot.requests}
          cars={snapshot.cars}
          events={snapshot.events}
          onAccept={acceptRequest}
          onReject={rejectRequest}
          onComplete={completeRequest}
          onBuyer={() => changePersona('buyer')}
        />
      )}
    </div>
  );
}
