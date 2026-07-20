-- Continuação da correção da 006, agora para TODAS as tabelas de dados da criança.
-- O fluxo padrão de onboarding (pai cria o perfil e toca "Começar a jogar") mantém
-- a sessão autenticada do PAI operando o perfil do filho. As policies de escrita
-- originais exigem auth.uid() = dono da linha, então nessa sessão o sync de
-- progress, companies, company_revenue e mission_completions falhava por RLS
-- (silenciosamente — só console.error/warn), e o banco central ficava zerado.
-- Verificado em 20/jul/2026: 9 perfis de criança do time interno, todos com
-- xp=0, 0 empresas e 0 missões no banco apesar do uso real nos aparelhos.

-- progress: pai insere/atualiza a linha dos próprios filhos
create policy "parent_write" on progress
  for insert
  with check (user_id in (select id from profiles where parent_id = auth.uid()));

create policy "parent_update" on progress
  for update
  using      (user_id in (select id from profiles where parent_id = auth.uid()))
  with check (user_id in (select id from profiles where parent_id = auth.uid()));

-- companies: idem (saveCompany faz upsert)
create policy "parent_write" on companies
  for insert
  with check (user_id in (select id from profiles where parent_id = auth.uid()));

create policy "parent_update" on companies
  for update
  using      (user_id in (select id from profiles where parent_id = auth.uid()))
  with check (user_id in (select id from profiles where parent_id = auth.uid()));

-- company_revenue: append-only, pai registra pelo device do filho
create policy "parent_write" on company_revenue
  for insert
  with check (user_id in (select id from profiles where parent_id = auth.uid()));

-- mission_completions: saveMissionReport faz upsert (insert + update no conflito)
create policy "parent_write" on mission_completions
  for insert
  with check (child_profile_id in (select id from profiles where parent_id = auth.uid()));

create policy "parent_update" on mission_completions
  for update
  using      (child_profile_id in (select id from profiles where parent_id = auth.uid()))
  with check (child_profile_id in (select id from profiles where parent_id = auth.uid()));
