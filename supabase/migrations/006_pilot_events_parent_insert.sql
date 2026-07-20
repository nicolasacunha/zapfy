-- Correção do espelho do piloto: o fluxo padrão de onboarding mantém a
-- sessão do PAI operando o perfil do filho (childProfileId = children[0]),
-- mas a policy "child_own" só aceita INSERT quando child_profile_id = auth.uid().
-- Resultado: todo insert em pilot_events pela sessão do pai era negado pela RLS
-- (silenciosamente — só console.warn), e a tabela ficava vazia mesmo com uso real.
-- Verificado em 20/jul/2026: erro 42501 reproduzido com sessão de pai.

create policy "parent_write" on pilot_events
  for insert
  with check (
    child_profile_id in (
      select id from profiles where parent_id = auth.uid()
    )
  );
